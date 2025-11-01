// client/src/store/useMessageStore.js

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
export const useMessageStore = create((set, get) => ({
  // State variables:
  // `messages`: Stores the list of messages in the current conversation.
  // `loading`: Indicates whether messages are being loaded.
  messages: [],
  loading: true,

  // NEW: unread message tracking
  unreadTotal: 0, // total unread messages across all conversations
  unreadMap: {}, // per-user unread count, e.g. { "userId1": 2, "userId2": 5 }

  /**
   * Action: Send a message to a specific user (text or file).
   * Supports optimistic UI and multipart uploads.
   */
  sendMessage: async (receiverId, content, file) => {
    try {
      // Prepare optimistic message for instant UI feedback
      const tempId = Date.now();
      const optimisticMessage = {
        _id: tempId,
        sender: useAuthStore.getState().authUser._id,
        receiver: receiverId,
        content: content || "",
        file: file
          ? {
              url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
              filename: file.name,
              mimetype: file.type,
              size: file.size,
            }
          : undefined,
        createdAt: new Date().toISOString(),
        optimistic: true,
      };

      // Add message instantly to UI
      set((state) => ({ messages: [...state.messages, optimisticMessage] }));

      // API call
      let res;
      if (file) {
        // Use multipart/form-data for file uploads
        const form = new FormData();
        form.append("receiverId", receiverId);
        form.append("content", content || "");
        form.append("file", file);
        res = await axiosInstance.post("/messages/send", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axiosInstance.post("/messages/send", { receiverId, content });
      }

      // Replace optimistic message with server-confirmed message
      const savedMessage = res.data.message;
      set((state) => ({
        messages: state.messages.map((m) => (m._id === tempId ? savedMessage : m)),
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");

      // Remove optimistic message on failure
      set((state) => ({
        messages: state.messages.filter((m) => !m.optimistic),
      }));
    }
  },

  /**
   * Action: Delete a specific message.
   * Only the sender can delete their messages.
   */
  deleteMessage: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
  },

  /**
   * Action: Fetch conversation messages for a user.
   */
  getMessages: async (userId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ messages: [] });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * NEW: Get total and per-conversation unread counts.
   */
  getUnreadCounts: async () => {
    try {
      const res = await axiosInstance.get("/messages/unread-count");
      set({
        unreadTotal: res.data.totalUnread || 0,
        unreadMap: res.data.unreadMap || {},
      });
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  },

  /**
   * NEW: Mark a specific conversation as read.
   */
  markAsRead: async (userId) => {
    try {
      const res = await axiosInstance.post(`/messages/read/${userId}`);
      set((state) => ({
        unreadTotal: res.data.totalUnread ?? 0,
        unreadMap: { ...state.unreadMap, [userId]: 0 },
      }));
    } catch (error) {
      console.error("Error marking read:", error);
    }
  },

  /**
   * Action: Subscribe to real-time message updates via WebSocket.
   */
  subscribeToMessages: () => {
    const socket = getSocket();

    // Listen for new incoming messages
    socket.on("newMessage", ({ message }) => {
      set((state) => ({ messages: [...state.messages, message] }));

      // Increment unread count if current user is receiver
      const myId = useAuthStore.getState().authUser._id;
      if (message.receiver === myId) {
        set((state) => {
          const prev = state.unreadMap[message.sender] || 0;
          return {
            unreadTotal: (state.unreadTotal || 0) + 1,
            unreadMap: { ...state.unreadMap, [message.sender]: prev + 1 },
          };
        });
      }
    });

    // Listen for message deletions
    socket.on("messageDeleted", ({ messageId }) => {
      set((state) => ({
        messages: state.messages.filter((m) => m._id !== messageId),
      }));
    });

    // Listen for unread updates from server
    socket.on("unreadCount", ({ totalUnread }) => {
      set({ unreadTotal: totalUnread });
    });

    socket.on("unreadMapUpdate", ({ conversationId, count }) => {
      set((state) => ({
        unreadMap: { ...state.unreadMap, [conversationId]: count },
      }));
    });
  },

  /**
   * Action: Unsubscribe from real-time message updates.
   */
  unsubscribeFromMessages: () => {
    const socket = getSocket();
    socket.off("newMessage");
    socket.off("messageDeleted");
    socket.off("unreadCount");
    socket.off("unreadMapUpdate");
  },
}));
