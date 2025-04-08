// Import necessary libraries and modules.
// `zustand` is used to create a global state store.
// `axiosInstance` is a pre-configured Axios instance for making API requests.
// `react-hot-toast` is used for displaying toast notifications.
// `getSocket` is used to manage WebSocket connections.
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

// Create a Zustand store for managing match-related state and actions.
export const useMatchStore = create((set) => ({
    // State variables:
    // `matches`: Stores the list of matches for the authenticated user.
	// `isLoadingMyMatches`: Indicates whether the user's matches are being loaded.
    // `isLoadingUserProfiles`: Indicates whether user profiles are being loaded.
    // `userProfiles`: Stores the list of user profiles available for swiping.
    // `swipeFeedback`: Stores feedback for swipe actions (e.g., "liked", "passed").
    matches: [],
    isLoadingMyMatches: false,
    isLoadingUserProfiles: false,
    userProfiles: [],
    swipeFeedback: null,

    // Action: Fetches the authenticated user's matches from the server.
    getMyMatches: async () => {
        try {
            // Set `isLoadingMyMatches` to true to indicate the operation has started.
            set({ isLoadingMyMatches: true });

            // Make an API request to fetch the user's matches.
            const res = await axiosInstance.get("/matches");

            // Update the `matches` state with the fetched data.
            set({ matches: res.data.matches });
        } catch (error) {
            // If the request fails, clear the `matches` state and show an error toast.
            set({ matches: [] });
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            // Set `isLoadingMyMatches` to false to indicate the operation has completed.
            set({ isLoadingMyMatches: false });
        }
    },

    // Action: Fetches user profiles available for swiping.
    getUserProfiles: async () => {
        try {
            // Set `isLoadingUserProfiles` to true to indicate the operation has started.
            set({ isLoadingUserProfiles: true });

            // Make an API request to fetch user profiles.
            const res = await axiosInstance.get("/matches/user-profiles");

            // Update the `userProfiles` state with the fetched data.
            set({ userProfiles: res.data.users });
        } catch (error) {
            // If the request fails, clear the `userProfiles` state and show an error toast.
            set({ userProfiles: [] });
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            // Set `isLoadingUserProfiles` to false to indicate the operation has completed.
            set({ isLoadingUserProfiles: false });
        }
    },

    // Action: Handles a "swipe left" action on a user profile.
    swipeLeft: async (user) => {
        try {
            // Set `swipeFeedback` to "passed" to indicate the swipe action.
            set({ swipeFeedback: "passed" });

            // Make an API request to record the "swipe left" action.
            await axiosInstance.post("/matches/swipe-left/" + user._id);
        } catch (error) {
            // Log the error and show an error toast if the request fails.
            console.log(error);
            toast.error("Failed to swipe left");
        } finally {
            // Clear the `swipeFeedback` state after a short delay.
            setTimeout(() => set({ swipeFeedback: null }), 1500);
        }
    },

    // Action: Handles a "swipe right" action on a user profile.
    swipeRight: async (user) => {
        try {
            // Set `swipeFeedback` to "liked" to indicate the swipe action.
            set({ swipeFeedback: "liked" });

            // Make an API request to record the "swipe right" action.
            await axiosInstance.post("/matches/swipe-right/" + user._id);
        } catch (error) {
            // Log the error and show an error toast if the request fails.
            console.log(error);
            toast.error("Failed to swipe right");
        } finally {
            // Clear the `swipeFeedback` state after a short delay.
            setTimeout(() => set({ swipeFeedback: null }), 1500);
        }
    },

    // Action: Subscribes to new match notifications via WebSocket.
    subscribeToNewMatches: () => {
        try {
            // Get the WebSocket instance.
            const socket = getSocket();

            // Listen for "newMatch" events and update the `matches` state.
            socket.on("newMatch", (newMatch) => {
                set((state) => ({
                    matches: [...state.matches, newMatch],
                }));

                // Show a success toast notification for the new match.
                toast.success("You got a new match!");
            });
        } catch (error) {
            // Log any errors that occur during subscription.
            console.log(error);
        }
    },

    // Action: Unsubscribes from new match notifications via WebSocket.
    unsubscribeFromNewMatches: () => {
        try {
            // Get the WebSocket instance.
            const socket = getSocket();

            // Remove the "newMatch" event listener.
            socket.off("newMatch");
        } catch (error) {
            // Log any errors that occur during unsubscription.
            console.error(error);
        }
    },
}));
