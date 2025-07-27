// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
// 	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });
// console.log("🔍 CLOUD_NAME", process.env.CLOUDINARY_CLOUD_NAME);
// console.log("🔍 API_KEY", process.env.CLOUDINARY_API_KEY);
// console.log(
// 	"🔍 API_SECRET",
// 	process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing"
// );

// export default cloudinary;

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve path to api/.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// console.log("🔧 Configuring Cloudinary...");
// console.log(
// 	"📸 CLOUD_NAME:",
// 	process.env.CLOUDINARY_CLOUD_NAME || "❌ Not found"
// );
// console.log("🔑 API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ Not found");
// console.log(
// 	"🔐 API_SECRET:",
// 	process.env.CLOUDINARY_API_SECRET ? "✅ Found" : "❌ Missing"
// );

export default cloudinary;
