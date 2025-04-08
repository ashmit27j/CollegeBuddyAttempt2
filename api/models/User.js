// Import necessary modules.
// `mongoose`: Library for defining and interacting with MongoDB schemas.
// `bcrypt`: Library for hashing and comparing passwords.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for a user document.
const userSchema = new mongoose.Schema(
  {
    // User's name.
    name: {
      type: String,
      required: true,
    },
    // User's email address.
    // Must be unique to ensure no duplicate accounts.
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // User's hashed password.
    password: {
      type: String,
      required: true,
    },
    // User's age.
    age: {
      type: Number,
      required: true,
    },
    // User's gender.
    // Must be one of the specified values: "male" or "female".
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    // User's gender preference for matches.
    // Can be "male", "female", or "both".
    genderPreference: {
      type: String,
      required: true,
      enum: ["male", "female", "both"],
    },
    // User's bio (optional).
    bio: { type: String, default: "" },
    // User's profile image URL (optional).
    image: { type: String, default: "" },
    // List of users the current user has liked.
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // List of users the current user has disliked.
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // List of users the current user has matched with.
    matches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  // Schema options:
  // `timestamps`: Automatically adds `createdAt` and `updatedAt` fields to the document.
  { timestamps: true }
);

// Middleware: Hash the password before saving the user document.
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified.
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password with a salt factor of 10.
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method: Compare entered password with the hashed password in the database.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the `User` model using the schema.
const User = mongoose.model("User", userSchema);

// Export the `User` model for use in other parts of the application.
export default User;
