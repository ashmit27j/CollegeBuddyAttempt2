// Import necessary modules and models.
// `Message`: Mongoose model for storing messages.
// `getConnectedUsers` and `getIO`: Functions for managing real-time socket connections.
import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// Controller: Handles sending a new message.
export const sendMessage = async (req, res) => {
    try {
        // Extract the message content and receiver ID from the request body.
        const { content, receiverId } = req.body;

        // Create a new message in the database.
        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: receiverId,
            content,
        });

        // Get the socket.io instance and connected users.
        const io = getIO();
        const connectedUsers = getConnectedUsers();

        // Check if the receiver is online and send the message in real-time.
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                message: newMessage,
            });
        }

        // Respond with the created message.
        res.status(201).json({
            success: true,
            message: newMessage,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in sendMessage: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Controller: Fetches the conversation between the current user and another user.
export const getConversation = async (req, res) => {
    // Extract the other user's ID from the request parameters.
    const { userId } = req.params;

    try {
        // Query the database for messages between the current user and the other user.
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id },
            ],
        }).sort("createdAt"); // Sort messages by creation time.

        // Respond with the list of messages.
        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in getConversation: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
