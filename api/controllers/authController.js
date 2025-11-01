// ✅ Load environment variables before anything else
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// 📦 Imports
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

// 🧩 Debug check
console.log(
  "🔹 ENV check inside authController →",
  process.env.EMAIL_USER,
  process.env.EMAIL_PASS ? "✔️ Present" : "❌ Missing"
);

// 🔐 Pending signups in memory (OTP verification pending users)
const pendingSignups = new Map(); // key = email, value = { userData, otp, otpExpire }

// 🔑 Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✉️ Configure Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    type: "login",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// 🔍 Verify transporter
transporter.verify((error, success) => {
  if (error) console.error("❌ Email transporter connection failed:", error);
  else console.log("✅ Email transporter ready to send messages");
});

// 📬 Helper to send emails
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const info = await transporter.sendMail({ from, to, subject, text, html });
    console.log("📧 Email sent:", info.messageId || info);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

// 📝 Signup Controller
export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;

  try {
    // Validation
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "You must be at least 18 years old",
      });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8+ characters and include uppercase, lowercase, number, and symbol.",
      });
    }

    // Check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      if (!existing.emailVerified) {
        await User.deleteOne({ email });
        console.log("Deleted unverified user:", email);
      } else {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    // Store temporarily
    pendingSignups.set(email, {
      userData: { name, email, password, age, gender, genderPreference },
      otp,
      otpExpire,
    });

    // Send OTP Email
    const subject = "CollegeBuddy — Verify your email (OTP)";
    const text = `Your verification code is ${otp}. It is valid for 10 minutes.`;
    const html = `<p>Your verification code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`;
    await sendEmail({ to: email, subject, text, html });

    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete signup.",
      email,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧩 Verify OTP Controller (Fixed - no double hashing)
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const pending = pendingSignups.get(email);
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "Signup session expired. Please sign up again.",
      });
    }

    if (pending.otp !== otp || Date.now() > pending.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const { userData } = pending;
    const newUser = await User.create({
      ...userData,
      emailVerified: true,
    });

    pendingSignups.delete(email);

    const token = signToken(newUser._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    newUser.password = undefined;
    res.status(200).json({
      success: true,
      message: "Email verified successfully. Account created.",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔐 Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email first.",
      });
    }

    const token = signToken(user._id);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    user.password = undefined;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🚪 Logout Controller
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// 🔁 Resend OTP Controller
export const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const pending = pendingSignups.get(email);
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "Signup session expired. Please sign up again.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pending.otp = otp;
    pending.otpExpire = Date.now() + 10 * 60 * 1000;
    pendingSignups.set(email, pending);

    const subject = "CollegeBuddy — Your verification OTP (Resend)";
    const text = `Your new verification code is ${otp}. It is valid for 10 minutes.`;
    const html = `<p>Your new verification code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`;
    await sendEmail({ to: email, subject, text, html });

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.log("Error in resendOtp:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔄 Forgot Password Controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const subject = "CollegeBuddy Password Reset";
    const text = `You requested a password reset. Click the link to reset (valid 10 minutes): ${resetLink}`;
    const html = `<p>You requested a password reset. Click below (valid 10 minutes):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>`;

    await sendEmail({ to: user.email, subject, text, html });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🔒 Reset Password Controller
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8+ characters and include uppercase, lowercase, number, and symbol.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
