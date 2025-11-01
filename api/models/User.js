// Import necessary modules.
// `mongoose`: Library for defining and interacting with MongoDB schemas.
// `bcrypt`: Library for hashing and comparing passwords.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for a user document.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    genderPreference: { type: String, required: true, enum: ["male", "female", "both"] },
    bio: { type: String, default: "" },
    image: { type: String, default: "" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // --- New fields for OTP / reset flows ---
    otp: { type: String },
    otpExpire: { type: Date },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },

    // 🔒 FIX: Ensure field always exists
    emailVerified: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

// Middleware: Hash the password before saving the user document.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method: Compare entered password with the hashed password in the database.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
