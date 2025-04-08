// Import necessary modules.
// `mongoose`: Library for interacting with MongoDB.
// `bcrypt`: Library for hashing passwords.
// `User`: Mongoose model for user data.
// `dotenv`: Library for loading environment variables from a `.env` file.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

// Load environment variables from the `.env` file.
dotenv.config();

// Arrays of sample male and female names for generating user data.
const maleNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas"];
const femaleNames = [
    "Mary",
    "Patricia",
    "Jennifer",
    "Linda",
    "Elizabeth",
    "Barbara",
    "Susan",
    "Jessica",
    "Sarah",
    "Karen",
    "Nancy",
    "Lisa",
];

// Array of gender preferences for matches.
const genderPreferences = ["male", "female", "both"];

// Array of bio descriptors for generating random user bios.
const bioDescriptors = [
    "Coffee addict",
    "Cat lover",
    "Dog person",
    "Foodie",
    "Gym rat",
    "Bookworm",
    "Movie buff",
    "Music lover",
    "Travel junkie",
    "Beach bum",
    "City slicker",
    "Outdoor enthusiast",
    "Netflix binger",
    "Yoga enthusiast",
    "Craft beer connoisseur",
    "Sushi fanatic",
    "Adventure seeker",
    "Night owl",
    "Early bird",
    "Aspiring chef",
];

// Function: Generates a random bio by selecting three random descriptors.
const generateBio = () => {
    const descriptors = bioDescriptors.sort(() => 0.5 - Math.random()).slice(0, 3);
    return descriptors.join(" | ");
};

// Function: Generates a random user object based on gender and index.
const generateRandomUser = (gender, index) => {
    const names = gender === "male" ? maleNames : femaleNames;
    const name = names[index];
    const age = Math.floor(Math.random() * (45 - 21 + 1) + 21); // Random age between 21 and 45.
    return {
        name,
        email: `${name.toLowerCase()}${age}@example.com`, // Unique email based on name and age.
        password: bcrypt.hashSync("password123", 10), // Hashed password.
        age,
        gender,
        genderPreference: genderPreferences[Math.floor(Math.random() * genderPreferences.length)], // Random gender preference.
        bio: generateBio(), // Randomly generated bio.
        image: `/${gender}/${index + 1}.jpg`, // Placeholder image path.
    };
};

// Function: Seeds the database with random user data.
const seedUsers = async () => {
    try {
        // Connect to the MongoDB database.
        await mongoose.connect(process.env.MONGO_URI);

        // Clear the existing user data.
        await User.deleteMany({});

        // Generate random male and female users.
        const maleUsers = maleNames.map((_, i) => generateRandomUser("male", i));
        const femaleUsers = femaleNames.map((_, i) => generateRandomUser("female", i));

        // Combine male and female users into a single array.
        const allUsers = [...maleUsers, ...femaleUsers];

        // Insert the generated users into the database.
        await User.insertMany(allUsers);

        // Log success message.
        console.log("Database seeded successfully with users having concise bios");
    } catch (error) {
        // Log any errors that occur during the seeding process.
        console.error("Error seeding database:", error);
    } finally {
        // Disconnect from the database.
        mongoose.disconnect();
    }
};

// Call the `seedUsers` function to seed the database.
seedUsers();
