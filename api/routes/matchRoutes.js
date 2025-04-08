// Import necessary modules and middleware.
// `express`: Framework for building web applications and APIs.
// `protectRoute`: Middleware for protecting routes by verifying the user's JWT token.
// `getMatches`, `getUserProfiles`, `swipeLeft`, `swipeRight`: Controllers for handling match-related actions.
import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getMatches, getUserProfiles, swipeLeft, swipeRight } from "../controllers/matchController.js";

// Create a new router instance.
const router = express.Router();

// Route: Handles the "swipe right" action (liking a user).
// Protected by the `protectRoute` middleware to ensure only authenticated users can access it.
// Calls the `swipeRight` controller to process the like action.
router.post("/swipe-right/:likedUserId", protectRoute, swipeRight);

// Route: Handles the "swipe left" action (disliking a user).
// Protected by the `protectRoute` middleware to ensure only authenticated users can access it.
// Calls the `swipeLeft` controller to process the dislike action.
router.post("/swipe-left/:dislikedUserId", protectRoute, swipeLeft);

// Route: Fetches the current user's matches.
// Protected by the `protectRoute` middleware to ensure only authenticated users can access it.
// Calls the `getMatches` controller to retrieve the list of matches.
router.get("/", protectRoute, getMatches);

// Route: Fetches user profiles for swiping.
// Protected by the `protectRoute` middleware to ensure only authenticated users can access it.
// Calls the `getUserProfiles` controller to retrieve profiles based on user preferences.
router.get("/user-profiles", protectRoute, getUserProfiles);

// Export the router for use in other parts of the application.
export default router;
