// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import { createServer } from "http";

// // Fix __dirname in ES modules

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// // ✅ Load .env from current directory
// dotenv.config({ path: path.join(__dirname, ".env") });
// console.log("✅ DEBUG MONGO_URI =", process.env.MONGO_URI);

// // routes
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import matchRoutes from "./routes/matchRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";

// import { connectDB } from "./config/db.js";
// import { initializeSocket } from "./socket/socket.server.js";


// const app = express();
// const httpServer = createServer(app);
// const PORT = process.env.PORT || 5000;

// initializeSocket(httpServer);

// app.use(express.json());
// app.use(cookieParser());
// app.use(
// 	cors({
// 		origin: process.env.CLIENT_URL,
// 		credentials: true,
// 	})
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/matches", matchRoutes);
// app.use("/api/messages", messageRoutes);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/client/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// 	});
// }

// httpServer.listen(PORT, () => {
// 	console.log("Server started at this port:" + PORT);
// 	connectDB();
// });
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from current directory (inside /api)
dotenv.config({ path: path.join(__dirname, ".env") });

// ✅ Debug environment variables
// console.log("🔍 Loaded ENV:");
// console.log("MONGO_URI =", process.env.MONGO_URI || "❌ Not found");
// console.log("CLIENT_URL =", process.env.CLIENT_URL || "❌ Not found");
// console.log("PORT =", process.env.PORT || "❌ Not found");
// console.log(
// 	"CLOUDINARY_CLOUD_NAME =",
// 	process.env.CLOUDINARY_CLOUD_NAME || "❌ Not found"
// );
// console.log(
// 	"CLOUDINARY_API_KEY =",
// 	process.env.CLOUDINARY_API_KEY || "❌ Not found"
// );
// console.log(
// 	"CLOUDINARY_API_SECRET =",
// 	process.env.CLOUDINARY_API_SECRET ? "✅ Found" : "❌ Missing"
// );

// ✅ Initialize Express App
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// ✅ Connect Socket
import { initializeSocket } from "./socket/socket.server.js";
initializeSocket(httpServer);

// ✅ Connect MongoDB
import { connectDB } from "./config/db.js";

// ✅ Middleware for JSON and cookies
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ CORS middleware (must come before routes)
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	})
);

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

// ✅ Start server
httpServer.listen(PORT, () => {
	console.log(`🚀 Server running at http://localhost:${PORT}`);
	connectDB();
});
