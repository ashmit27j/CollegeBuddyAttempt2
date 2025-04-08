// Import the Mongoose library for defining and interacting with MongoDB schemas.
import mongoose from "mongoose";

// Define the schema for a message document.
const messageSchema = new mongoose.Schema(
    {
        // The sender of the message.
        // References the `User` model to establish a relationship.
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // The receiver of the message.
        // References the `User` model to establish a relationship.
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // The content of the message.
        content: {
            type: String,
            required: true,
        },
    },
    // Schema options:
    // `timestamps`: Automatically adds `createdAt` and `updatedAt` fields to the document.
    { timestamps: true }
);

// Create the `Message` model using the schema.
const Message = mongoose.model("Message", messageSchema);

// Export the `Message` model for use in other parts of the application.
export default Message;
