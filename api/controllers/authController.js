// Import necessary modules and models.
// `User`: Mongoose model for user data.
// `jwt`: Library for generating and verifying JSON Web Tokens.
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Function to generate a JWT token.
// Takes the user ID as input and signs it with the secret key.
// Token expires in 7 days.
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

// Controller: Handles user signup.
export const signup = async (req, res) => {
    // Destructure user details from the request body.
    const { name, email, password, age, gender, genderPreference } = req.body;

    try {
        // Validate required fields.
        if (!name || !email || !password || !age || !gender || !genderPreference) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Validate age (must be at least 18).
        if (age < 18) {
            return res.status(400).json({
                success: false,
                message: "You must be at least 18 years old",
            });
        }

        // Validate password length (minimum 6 characters).
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        // Create a new user in the database.
        const newUser = await User.create({
            name,
            email,
            password,
            age,
            gender,
            genderPreference,
        });

        // Generate a JWT token for the new user.
        const token = signToken(newUser._id);

        // Set the JWT token as a cookie in the response.
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Prevents XSS attacks.
            sameSite: "strict", // Prevents CSRF attacks.
            secure: process.env.NODE_ENV === "production", // Secure in production.
        });

        // Respond with the created user and success message.
        res.status(201).json({
            success: true,
            user: newUser,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in signup controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Controller: Handles user login.
export const login = async (req, res) => {
    // Destructure email and password from the request body.
    const { email, password } = req.body;

    try {
        // Validate required fields.
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Find the user by email and include the password field.
		const user = await User.findOne({ email }).select("+password");

        // Validate user existence and password match.
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate a JWT token for the user.
        const token = signToken(user._id);

        // Set the JWT token as a cookie in the response.
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            httpOnly: true, // Prevents XSS attacks.
            sameSite: "strict", // Prevents CSRF attacks.
            secure: process.env.NODE_ENV === "production", // Secure in production.
        });

        // Respond with the authenticated user and success message.
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in login controller:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Controller: Handles user logout.
export const logout = async (req, res) => {
    // Clear the JWT cookie.
    res.clearCookie("jwt");

    // Respond with a success message.
    res.status(200).json({ success: true, message: "Logged out successfully" });
};
