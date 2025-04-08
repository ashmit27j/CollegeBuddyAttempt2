// Import necessary modules and models.
// `User`: Mongoose model for user data.
// `getConnectedUsers` and `getIO`: Functions for managing real-time socket connections.
import User from "../models/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

// Controller: Handles the "swipe right" action (liking a user).
export const swipeRight = async (req, res) => {
    try {
        // Extract the liked user's ID from the request parameters.
        const { likedUserId } = req.params;

        // Fetch the current user and the liked user from the database.
        const currentUser = await User.findById(req.user.id);
        const likedUser = await User.findById(likedUserId);

        // Check if the liked user exists.
        if (!likedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Add the liked user to the current user's "likes" list if not already present.
        if (!currentUser.likes.includes(likedUserId)) {
            currentUser.likes.push(likedUserId);
            await currentUser.save();

            // Check if the liked user has already liked the current user (mutual match).
            if (likedUser.likes.includes(currentUser.id)) {
                // Add each user to the other's "matches" list.
                currentUser.matches.push(likedUserId);
                likedUser.matches.push(currentUser.id);

                // Save both users to the database.
                await Promise.all([currentUser.save(), likedUser.save()]);

                // Notify both users of the new match in real-time using socket.io.
                const connectedUsers = getConnectedUsers();
                const io = getIO();

                // Notify the liked user if they are online.
                const likedUserSocketId = connectedUsers.get(likedUserId);
                if (likedUserSocketId) {
                    io.to(likedUserSocketId).emit("newMatch", {
                        _id: currentUser._id,
                        name: currentUser.name,
                        image: currentUser.image,
                    });
                }

                // Notify the current user if they are online.
                const currentSocketId = connectedUsers.get(currentUser._id.toString());
                if (currentSocketId) {
                    io.to(currentSocketId).emit("newMatch", {
                        _id: likedUser._id,
                        name: likedUser.name,
                        image: likedUser.image,
                    });
                }
            }
        }

        // Respond with the updated current user.
        res.status(200).json({
            success: true,
            user: currentUser,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in swipeRight: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Controller: Handles the "swipe left" action (disliking a user).
export const swipeLeft = async (req, res) => {
    try {
        // Extract the disliked user's ID from the request parameters.
        const { dislikedUserId } = req.params;

        // Fetch the current user from the database.
        const currentUser = await User.findById(req.user.id);

        // Add the disliked user to the current user's "dislikes" list if not already present.
        if (!currentUser.dislikes.includes(dislikedUserId)) {
            currentUser.dislikes.push(dislikedUserId);
            await currentUser.save();
        }

        // Respond with the updated current user.
        res.status(200).json({
            success: true,
            user: currentUser,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in swipeLeft: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Controller: Fetches the current user's matches.
export const getMatches = async (req, res) => {
    try {
        // Fetch the current user and populate the "matches" field with user details.
        const user = await User.findById(req.user.id).populate("matches", "name image");

        // Respond with the list of matches.
        res.status(200).json({
            success: true,
            matches: user.matches,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in getMatches: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Controller: Fetches user profiles for swiping.
export const getUserProfiles = async (req, res) => {
    try {
        // Fetch the current user from the database.
        const currentUser = await User.findById(req.user.id);

        // Query the database for users who meet the swiping criteria.
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUser.id } }, // Exclude the current user.
                { _id: { $nin: currentUser.likes } }, // Exclude users already liked.
                { _id: { $nin: currentUser.dislikes } }, // Exclude users already disliked.
                { _id: { $nin: currentUser.matches } }, // Exclude users already matched.
                {
                    gender:
                        currentUser.genderPreference === "both"
                            ? { $in: ["male", "female"] }
                            : currentUser.genderPreference, // Match gender preference.
                },
                { genderPreference: { $in: [currentUser.gender, "both"] } }, // Match the other user's preference.
            ],
        });

        // Respond with the list of user profiles.
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in getUserProfiles: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
