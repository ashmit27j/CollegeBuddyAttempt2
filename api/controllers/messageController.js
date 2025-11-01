import Message from "../models/Message.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";

/* ----------------- helper upload ----------------- */
const uploadBufferToCloudinary = (buffer, folder = "collegebuddy_files", originalname) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        filename_override: originalname,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/* ----------------- send message ----------------- */
export const sendMessage = async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const messagePayload = {
      sender: req.user._id || req.user.id,
      receiver: receiverId,
      content: content || "",
      read: false,
    };

    if (req.file) {
      const uploadResult = await uploadBufferToCloudinary(
        req.file.buffer,
        "collegebuddy_files",
        req.file.originalname
      );
      messagePayload.file = {
        url: uploadResult.secure_url || uploadResult.url,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        resource_type: uploadResult.resource_type,
        public_id: uploadResult.public_id,
      };
    }

    const newMessage = await Message.create(messagePayload);

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", { message: newMessage });

    const senderSocketId = connectedUsers.get(req.user._id || req.user.id);
    if (senderSocketId) io.to(senderSocketId).emit("newMessage", { message: newMessage });

    const totalUnread = await Message.countDocuments({ receiver: receiverId, read: false });
    const convUnread = await Message.countDocuments({
      receiver: receiverId,
      sender: req.user._id || req.user.id,
      read: false,
    });

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("unreadCount", { totalUnread });
      io.to(receiverSocketId).emit("unreadMapUpdate", {
        conversationId: req.user._id || req.user.id,
        count: convUnread,
      });
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/* ----------------- get conversation ----------------- */
export const getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    }).sort("createdAt");

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getConversation:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/* ----------------- delete message ----------------- */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id || req.user.id;

    const message = await Message.findById(messageId);
    if (!message)
      return res.status(404).json({ success: false, message: "Message not found" });

    if (message.sender.toString() !== userId.toString())
      return res.status(403).json({ success: false, message: "Not authorized to delete" });

    // Delete file from Cloudinary if attached
    if (message.file && message.file.public_id) {
      try {
        await cloudinary.uploader.destroy(message.file.public_id, {
          resource_type: message.file.resource_type || "auto",
        });
      } catch (cloudErr) {
        console.warn("Cloudinary deletion warning:", cloudErr.message);
      }
    }

    await message.deleteOne();

    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const receiverSocket = connectedUsers.get(message.receiver.toString());
    const senderSocket = connectedUsers.get(message.sender.toString());
    const payload = { messageId };

    if (receiverSocket) io.to(receiverSocket).emit("messageDeleted", payload);
    if (senderSocket) io.to(senderSocket).emit("messageDeleted", payload);

    res.status(200).json({ success: true, message: "Message deleted", messageId });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ----------------- unread counts ----------------- */
export const getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const totalUnread = await Message.countDocuments({
      receiver: userId,
      read: false,
    });

    const agg = await Message.aggregate([
      { $match: { receiver: new mongoose.Types.ObjectId(userId), read: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } },
    ]);

    const unreadMap = {};
    agg.forEach((r) => {
      unreadMap[r._id.toString()] = r.count;
    });

    res.status(200).json({ success: true, totalUnread, unreadMap });
  } catch (error) {
    console.error("Error in getUnreadCounts:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* ----------------- mark as read ----------------- */
export const markConversationRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { $set: { read: true } }
    );

    const totalUnread = await Message.countDocuments({
      receiver: currentUserId,
      read: false,
    });
    const convUnread = 0;

    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const currentSocket = connectedUsers.get(currentUserId);
    if (currentSocket) {
      io.to(currentSocket).emit("unreadCount", { totalUnread });
      io.to(currentSocket).emit("unreadMapUpdate", {
        conversationId: userId,
        count: convUnread,
      });
    }

    res.status(200).json({ success: true, totalUnread, convUnread });
  } catch (error) {
    console.error("Error in markConversationRead:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
