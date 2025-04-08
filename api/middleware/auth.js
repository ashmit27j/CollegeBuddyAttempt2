// Import necessary modules.
// `jwt`: Library for generating and verifying JSON Web Tokens.
// `User`: Mongoose model for user data.
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware: Protects routes by verifying the user's JWT token.
export const protectRoute = async (req, res, next) => {
    try {
        // Extract the JWT token from the cookies.
        const token = req.cookies.jwt;

        // Check if the token is missing.
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized - No token provided",
            });
        }

        // Verify the token using the secret key.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is invalid.
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Not authorized - Invalid token",
            });
        }

        // Find the user associated with the token.
        const currentUser = await User.findById(decoded.id);

        // Attach the user data to the request object for downstream use.
        req.user = currentUser;

        // Proceed to the next middleware or route handler.
        next();
    } catch (error) {
        // Log and handle errors.
        console.log("Error in auth middleware: ", error);

        // Handle invalid token errors.
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Not authorized - Invalid token",
            });
        } else {
            // Handle other server errors.
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
};
