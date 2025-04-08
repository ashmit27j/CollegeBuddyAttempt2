// Import necessary libraries and modules.
// `zustand` is used to create a global state store.
// `axiosInstance` is a pre-configured Axios instance for making API requests.
// `react-hot-toast` is used for displaying toast notifications.
// `getSocket` is used to manage WebSocket connections.
// `useAuthStore` is used to access the authenticated user's data.
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

// Create a Zustand store for managing message-related state and actions.
export const useMessageStore = create((set) => ({
    // State variables:
    // `messages`: Stores the list of messages in the current conversation.
    // `loading`: Indicates whether messages are being loaded.
    messages: [],
    loading: true,

    // Action: Sends a message to a specific user.
    sendMessage: async (receiverId, content) => {
        try {
            // Optimistically add the message to the `messages` state to show it immediately in the chat.
            set((state) => ({
                messages: [
                    ...state.messages,
                    { _id: Date.now(), sender: useAuthStore.getState().authUser._id, content },
                ],
            }));

            // Make an API request to send the message to the server.
            const res = await axiosInstance.post("/messages/send", { receiverId, content });
            console.log("message sent", res.data);
        } catch (error) {
            // Show an error toast notification if the API request fails.
            toast.error(error.response.data.message || "Something went wrong");
        }
    },

    // Action: Fetches the messages for a specific conversation.
    getMessages: async (userId) => {
        try {
            // Set `loading` to true to indicate the operation has started.
            set({ loading: true });

            // Make an API request to fetch the conversation messages.
            const res = await axiosInstance.get(`/messages/conversation/${userId}`);

            // Update the `messages` state with the fetched data.
            set({ messages: res.data.messages });
        } catch (error) {
            // Log the error and clear the `messages` state if the request fails.
            console.log(error);
            set({ messages: [] });
        } finally {
            // Set `loading` to false to indicate the operation has completed.
            set({ loading: false });
        }
    },

    // Action: Subscribes to real-time message updates via WebSocket.
    subscribeToMessages: () => {
        // Get the WebSocket instance.
        const socket = getSocket();

        // Listen for "newMessage" events and update the `messages` state with the new message.
        socket.on("newMessage", ({ message }) => {
            set((state) => ({ messages: [...state.messages, message] }));
        });
    },

    // Action: Unsubscribes from real-time message updates via WebSocket.
    unsubscribeFromMessages: () => {
        // Get the WebSocket instance.
        const socket = getSocket();

        // Remove the "newMessage" event listener.
        socket.off("newMessage");
    },
}));
