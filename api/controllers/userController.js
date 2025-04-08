// Import necessary modules and models.
// `cloudinary`: Used for uploading and managing images in the cloud.
// `User`: Mongoose model for user data.
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

// Controller: Handles updating the user's profile.
export const updateProfile = async (req, res) => {
    // Extract the image and other profile data from the request body.
    try {
        const { image, ...otherData } = req.body;

        // Initialize the updated data with the non-image fields.
        let updatedData = otherData;

        // If an image is provided, process and upload it to Cloudinary.
        if (image) {
            // Check if the image is in base64 format.
            if (image.startsWith("data:image")) {
                try {
                    // Upload the image to Cloudinary and get the secure URL.
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    updatedData.image = uploadResponse.secure_url;
                } catch (uploadError) {
                    // Handle errors during the image upload process.
                    console.error("Error uploading image:", uploadError);

                    return res.status(400).json({
                        success: false,
                        message: "Error uploading image",
                    });
                }
            }
        }

        // Update the user's profile in the database with the new data.
        const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        // Respond with the updated user data.
        res.status(200).json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        // Log and handle server errors.
        console.log("Error in updateProfile: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
