// Import necessary libraries and modules.
// `zustand` is used to create a global state store.
// `axiosInstance` is a pre-configured Axios instance for making API requests.
// `react-hot-toast` is used for displaying toast notifications.
// `useAuthStore` is used to access and update the authenticated user's data.
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

// Create a Zustand store for managing user-related state and actions.
export const useUserStore = create((set) => ({
    // State variable:
    // `loading`: Indicates whether a user-related operation (e.g., profile update) is in progress.
    loading: false,

    // Action: Updates the user's profile.
    updateProfile: async (data) => {
        try {
            // Set `loading` to true to indicate the operation has started.
            set({ loading: true });

            // Make an API request to update the user's profile.
            const res = await axiosInstance.put("/users/update", data);

            // Update the authenticated user's data in the `useAuthStore`.
            useAuthStore.getState().setAuthUser(res.data.user);

            // Show a success toast notification to the user.
            toast.success("Profile updated successfully");
        } catch (error) {
            // Show an error toast notification if the API request fails.
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            // Set `loading` to false to indicate the operation has completed.
            set({ loading: false });
        }
    },
}));
