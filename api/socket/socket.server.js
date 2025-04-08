// Import the Server class from the socket.io library
import { Server } from "socket.io";

// Declare a variable to hold the Socket.IO server instance
let io;

// Create a Map to store connected users with their userId as the key and socketId as the value
const connectedUsers = new Map();
// Example: { userId: socketId }

/**
 * Initializes the Socket.IO server with the provided HTTP server.
 * Configures CORS and sets up middleware and event listeners.
 * 
 * @param {Object} httpServer - The HTTP server instance to attach the Socket.IO server to.
 */
export const initializeSocket = (httpServer) => {
    // Create a new Socket.IO server instance and configure CORS
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL, // Allow connections from the client URL specified in environment variables
            credentials: true, // Allow credentials (e.g., cookies) to be sent with requests
        },
    });

    // Middleware to authenticate users based on their userId
    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId; // Extract userId from the handshake authentication data
        if (!userId) return next(new Error("Invalid user ID")); // Reject connection if userId is missing

        socket.userId = userId; // Attach the userId to the socket object for later use
        next(); // Proceed to the next middleware or connection handler
    });

    // Event listener for new client connections
    io.on("connection", (socket) => {
        console.log(`User connected with socket id: ${socket.id}`); // Log the connection
        connectedUsers.set(socket.userId, socket.id); // Add the user to the connectedUsers map

        // Event listener for client disconnections
        socket.on("disconnect", () => {
            console.log(`User disconnected with socket id: ${socket.id}`); // Log the disconnection
            connectedUsers.delete(socket.userId); // Remove the user from the connectedUsers map
        });
    });
};

/**
 * Retrieves the initialized Socket.IO server instance.
 * Throws an error if the server has not been initialized.
 * 
 * @returns {Object} The Socket.IO server instance.
 */
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!"); // Throw an error if the server is not initialized
    }
    return io; // Return the initialized server instance
};

/**
 * Retrieves the map of connected users.
 * 
 * @returns {Map} A map of connected users with userId as the key and socketId as the value.
 */
export const getConnectedUsers = () => connectedUsers;
