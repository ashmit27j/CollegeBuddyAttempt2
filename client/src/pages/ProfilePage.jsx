// Import necessary libraries and components.
// `useRef` and `useState` are React hooks for managing local state and DOM references.
// `Header` is a reusable component for the page header.
// `useAuthStore` and `useUserStore` are Zustand stores for managing authentication and user-related state.
import { useRef, useState } from "react";
import { Header } from "../components/Header";
import { useAuthStore } from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";

const ProfilePage = () => {
    // Access the authenticated user's data from the `useAuthStore`.
    // Initialize local state for form fields (name, bio, age, gender, gender preference, and image).
    const { authUser } = useAuthStore();
    const [name, setName] = useState(authUser.name || "");
    const [bio, setBio] = useState(authUser.bio || "");
    const [age, setAge] = useState(authUser.age || "");
    const [gender, setGender] = useState(authUser.gender || "");
    const [genderPreference, setGenderPreference] = useState(authUser.genderPreference || []);
    const [image, setImage] = useState(authUser.image || null);

    // Create a reference for the file input element to programmatically trigger file selection.
    const fileInputRef = useRef(null);

    // Access the `loading` state and `updateProfile` action from the `useUserStore`.
    const { loading, updateProfile } = useUserStore();

    // Handle form submission to update the user's profile.
    // Prevents the default form submission behavior and calls the `updateProfile` action with the updated data.
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProfile({ name, bio, age, gender, genderPreference, image });
    };

    // Handle image file selection and convert the selected file to a Base64 string for preview.
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
			// Main container for the profile page with a gradient background.
			<div className="min-h-screen bg-gradient-to-br from-[#ffffff] to-[#d6edf5] flex flex-col">
				{/* Render the header component at the top of the page. */}
				<Header />

				{/* Main content area for the profile form. */}
				<div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
					{/* Title section */}
					<div className="sm:mx-auto sm:w-full sm:max-w-md">
						<h2 className="mt-6 text-center text-3xl font-semibold text-gray-900">
							Your Profile
						</h2>
					</div>

					{/* Profile form container */}
					<div className="mt-8 sm:mx-auto sm:w-full lg:max-w-7xl sm:max-w-md">
						<div className="bg-white py-8 px-4 shadow rounded-xl sm:rounded-lg sm:px-10 border border-gray-200">
							{/* Form for updating profile details */}
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Name input field */}
								<div>
									<label
										htmlFor="name"
										className="block text-sm font-medium text-gray-700"
									>
										Name
									</label>
									<div className="mt-1">
										<input
											id="name"
											name="name"
											type="text"
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="appearance-none bg-[#eaf6fa] block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D617A] focus:border-[#30a7cf] sm:text-sm"
										/>
									</div>
								</div>

								{/* Age input field */}
								<div>
									<label
										htmlFor="age"
										className="block text-sm font-medium text-gray-700"
									>
										Age
									</label>
									<div className="mt-1">
										<input
											id="age"
											name="age"
											type="number"
											required
											value={age}
											onChange={(e) => setAge(e.target.value)}
											className="appearance-none bg-[#eaf6fa] block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D617A] focus:border-[#30a7cf] sm:text-sm"
										/>
									</div>
								</div>

								{/* Gender selection (radio buttons) */}
								<div>
									<span className="block text-sm font-medium text-gray-700 mb-2">
										Gender
									</span>
									<div className="flex space-x-4">
										{["Male", "Female"].map((option) => (
											<label key={option} className="inline-flex items-center">
												<input
													type="radio"
													className="form-radio text-[#1D617A]"
													name="gender"
													value={option.toLowerCase()}
													checked={gender === option.toLowerCase()}
													onChange={() => setGender(option.toLowerCase())}
												/>
												<span className="ml-2">{option}</span>
											</label>
										))}
									</div>
								</div>

								{/* Gender preference selection (checkboxes) */}
								<div>
									<span className="block text-sm font-medium text-gray-700 mb-2">
										Gender Preference
									</span>
									<div className="flex space-x-4">
										{["Male", "Female", "Both"].map((option) => (
											<label key={option} className="inline-flex items-center">
												<input
													type="checkbox"
													className="form-checkbox text-[#1D617A]"
													checked={
														genderPreference.toLowerCase() ===
														option.toLowerCase()
													}
													onChange={() =>
														setGenderPreference(option.toLowerCase())
													}
												/>
												<span className="ml-2">{option}</span>
											</label>
										))}
									</div>
								</div>

								{/* Bio input field */}
								<div>
									<label
										htmlFor="bio"
										className="block text-sm font-medium text-gray-700"
									>
										Bio
									</label>
									<div className="mt-1">
										<textarea
											id="bio"
											name="bio"
											rows={3}
											value={bio}
											onChange={(e) => setBio(e.target.value)}
											className="appearance-none bg-[#eaf6fa] block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D617A] focus:border-[#30a7cf] sm:text-sm"
										/>
									</div>
								</div>
								{/* Stream input field */}
								<div>
									<label
										htmlFor="bio"
										className="block text-sm font-medium text-gray-700"
									>
										Stream
									</label>
									<div className="mt-1">
										<input
											id="stream"
											name="stream"
											type="text"
											rows={3}
											// value={bio}
											// onChange={(e) => setBio(e.target.value)}
											className="appearance-none bg-[#eaf6fa] block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D617A] focus:border-[#30a7cf] sm:text-sm"
										/>
									</div>
								</div>
								{/* Interest input field */}
								<div>
									<label
										htmlFor="Interests"
										className="block text-sm font-medium text-gray-700"
									>
										Interests
									</label>
									<div className="mt-1">
										<textarea
											id="Interests"
											name="interests"
											rows={3}
											// value={bio}
											// onChange={(e) => setBio(e.target.value)}
											className="appearance-none bg-[#eaf6fa] block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#1D617A] focus:border-[#30a7cf] sm:text-sm"
										/>
									</div>
								</div>

								{/* Image upload section */}
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Cover Image
									</label>
									<div className="mt-1 flex items-center">
										<button
											type="button"
											onClick={() => fileInputRef.current.click()}
											className="bg-[#eaf6fa] inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#30a7cf]"
										>
											Upload Image
										</button>
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											className="hidden"
											onChange={handleImageChange}
										/>
									</div>
								</div>

								{/* Preview of the uploaded image */}
								{image && (
									<div className="mt-4">
										<img
											src={image}
											alt="User Image"
											className="w-48 h-full object-cover rounded-md"
										/>
									</div>
								)}

								{/* Submit button */}
								<button
									type="submit"
									className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D617A] hover:bg-[#30a7cf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D617A]"
									disabled={loading}
								>
									{loading ? "Saving..." : "Save"}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
};

// Export the ProfilePage component for use in other parts of the application.
export default ProfilePage;
