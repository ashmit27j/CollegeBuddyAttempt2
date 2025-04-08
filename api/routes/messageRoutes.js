// Import necessary modules and middleware.
// `express`: Framework for building web applications and APIs.
// `protectRoute`: Middleware for protecting routes by verifying the user's JWT token.
// `getConversation`, `sendMessage`: Controllers for handling message-related actions.
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getConversation, sendMessage } from "../controllers/messageController.js";

// Create a new router instance.
const router = express.Router();

// Middleware: Protect all routes in this router.
// Ensures only authenticated users can access the message-related routes.
router.use(protectRoute);

// Route: Handles sending a new message.
// Calls the `sendMessage` controller to process and store the message.
router.post("/send", sendMessage);

// Route: Fetches the conversation between the current user and another user.
// Calls the `getConversation` controller to retrieve the messages.
router.get("/conversation/:userId", getConversation);

// Export the router for use in other parts of the application.
export default router;
