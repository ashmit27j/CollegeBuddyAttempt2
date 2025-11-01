// Import necessary libraries and modules.
// `zustand` is used to create a global state store.
// `axiosInstance` is a pre-configured Axios instance for making API requests.
// `react-hot-toast` is used for displaying toast notifications.
// `disconnectSocket` and `initializeSocket` manage WebSocket connections.
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

// Create a Zustand store for managing authentication-related state and actions.
export const useAuthStore = create((set) => ({
    // State: `authUser` stores the authenticated user's data.
    // `checkingAuth` indicates whether the app is verifying the user's authentication status.
    // `loading` indicates whether an authentication-related operation is in progress.
    authUser: null,
    checkingAuth: true,
    loading: false,

    // Action: Handles user signup.
    signup: async (signupData) => {
        try {
            // Password validation: Ensure the password is at least 6 characters long.
            if (signupData.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return { success: false, message: "Password too short" };
            }

            // Set `loading` to true to indicate the operation has started.
            set({ loading: true });

            // Make an API request to create a new user account.
            const res = await axiosInstance.post("/auth/signup", signupData);

            // Do NOT auto-login here. The server sent OTP to email.
            toast.success(res.data.message || "OTP sent to your email");

            // Return server response so the component navigates to verify page.
            return { success: true, email: res.data.email };
        } catch (error) {
            // Show an error toast notification if the API request fails.
            toast.error(error.response?.data?.message || "Something went wrong");
            return { success: false, message: error.response?.data?.message || "Server error" };
        } finally {
            // Set `loading` to false to indicate the operation has completed.
            set({ loading: false });
        }
    },

    // Action: Handles user login.
    login: async (loginData) => {
        try {
            // Password validation: Ensure the password is at least 6 characters long.
            if (loginData.password.length < 6) {
                toast.error("Password must be at least 6 characters long");
                return;
            }

            // Set `loading` to true to indicate the operation has started.
            set({ loading: true });

            // Make an API request to log in the user.
            const res = await axiosInstance.post("/auth/login", loginData);

            // Update the `authUser` state with the logged-in user's data.
            set({ authUser: res.data.user });

            // Initialize the WebSocket connection for the authenticated user.
            initializeSocket(res.data.user._id);

            // Show a success toast notification.
            toast.success("Logged in successfully");
        } catch (error) {
            // Show an error toast notification if the API request fails.
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            // Set `loading` to false to indicate the operation has completed.
            set({ loading: false });
        }
    },

    // Action: Handles user logout.
    logout: async () => {
        try {
            // Make an API request to log out the user.
            const res = await axiosInstance.post("/auth/logout");

            // Disconnect the WebSocket connection.
            disconnectSocket();

            // If the logout is successful, clear the `authUser` state.
            if (res.status === 200) set({ authUser: null });
        } catch (error) {
            // Show an error toast notification if the API request fails.
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    // Action: Checks the user's authentication status.
    checkAuth: async () => {
        try {
            // Make an API request to fetch the authenticated user's data.
            const res = await axiosInstance.get("/auth/me");

            // Initialize the WebSocket connection for the authenticated user.
            initializeSocket(res.data.user._id);

            // Update the `authUser` state with the fetched user's data.
            set({ authUser: res.data.user });
        } catch (error) {
            // If the request fails, clear the `authUser` state.
            set({ authUser: null });
            console.log(error);
        } finally {
            // Set `checkingAuth` to false to indicate the operation has completed.
            set({ checkingAuth: false });
        }
    },

    // Action: Updates the `authUser` state with new user data.
    setAuthUser: (user) => set({ authUser: user }),
}));
