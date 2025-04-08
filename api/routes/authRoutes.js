// Import necessary modules and middleware.
// `express`: Framework for building web applications and APIs.
// `signup`, `login`, `logout`: Controllers for handling authentication-related actions.
// `protectRoute`: Middleware for protecting routes by verifying the user's JWT token.
import express from "express";
import { signup, login, logout } from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.js";

// Create a new router instance.
const router = express.Router();

// Route: Handles user signup.
// Calls the `signup` controller to register a new user.
router.post("/signup", signup);

// Route: Handles user login.
// Calls the `login` controller to authenticate the user and issue a JWT token.
router.post("/login", login);

// Route: Handles user logout.
// Calls the `logout` controller to clear the user's JWT token.
router.post("/logout", logout);

// Route: Fetches the authenticated user's data.
// Protected by the `protectRoute` middleware to ensure only authenticated users can access it.
router.get("/me", protectRoute, (req, res) => {
    res.send({
        success: true,
        user: req.user, // The authenticated user's data is attached to the `req` object by the middleware.
    });
});

// Export the router for use in other parts of the application.
export default router;
