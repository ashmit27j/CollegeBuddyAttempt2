// Import necessary libraries and modules.
// `useState` is a React hook for managing local state.
// `useAuthStore` is a Zustand store for managing authentication-related actions and state.
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
    // State variables:
    // `name`, `email`, `password`, `gender`, `age`, and `genderPreference` store the form input values.
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [genderPreference, setGenderPreference] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Access the `signup` action and `loading` state from the `useAuthStore`.
    const { signup, loading } = useAuthStore();
    const navigate = useNavigate();

    // Function: Validates password complexity before submission.
    const validatePassword = (pwd) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(pwd);
    };

    return (
        // Form container:
        // Handles the `onSubmit` event to call the `signup` action with the form data.
        <form
            className="space-y-6"
            onSubmit={async (e) => {
                e.preventDefault();
                if (!validatePassword(password)) {
                    setPasswordError(
                        "Password must be 8+ characters and include uppercase, lowercase, number, and symbol."
                    );
                    return;
                }
                setPasswordError("");
                const result = await signup({ name, email, password, gender, age, genderPreference });
                if (result && result.success) {
                    // navigate to verify page with email
                    navigate(`/verify-otp?email=${encodeURIComponent(result.email)}`);
                }
            }}
        >
            {/* NAME INPUT */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm"
                    />
                </div>
            </div>

            {/* EMAIL INPUT */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm"
                    />
                </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm"
                    />
                </div>
                {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
            </div>

            {/* AGE INPUT */}
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
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
                        min="18"
                        max="120"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm"
                    />
                </div>
            </div>

            {/* GENDER SELECTION */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Your Gender</label>
                <div className="mt-2 flex flex-col gap-2">
                    <div className="flex items-center">
                        <input
                            id="male"
                            name="gender"
                            type="radio"
                            checked={gender === "male"}
                            onChange={() => setGender("male")}
                            className="h-4 w-4 text-[#1D617A] focus:ring-[#01BAFF] focus:border-[#01BAFF] rounded"
                        />
                        <label htmlFor="male" className="ml-2 block text-sm text-gray-900">
                            Male
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="female"
                            name="gender"
                            type="radio"
                            checked={gender === "female"}
                            onChange={() => setGender("female")}
                            className="h-4 w-4 text-[#1D617A] focus:ring-[#01BAFF] border-gray-300 rounded"
                        />
                        <label htmlFor="female" className="ml-2 block text-sm text-gray-900">
                            Female
                        </label>
                    </div>
                </div>
            </div>

            {/* GENDER PREFERENCE SELECTION */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Gender Preference</label>
                <div className="mt-2 space-y-2">
                    {["male", "female", "both"].map((option) => (
                        <div className="flex items-center" key={option}>
                            <input
                                id={`prefer-${option}`}
                                name="gender-preference"
                                type="radio"
                                value={option}
                                checked={genderPreference === option}
                                onChange={(e) => setGenderPreference(e.target.value)}
                                className="h-4 w-4 text-[#1D617A] focus:ring-[#01BAFF] border-gray-300"
                            />
                            <label
                                htmlFor={`prefer-${option}`}
                                className="ml-2 block text-sm text-gray-900 capitalize"
                            >
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div>
                <button
                    type="submit"
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white ${
                        loading
                            ? "bg-[#01BAFF80] cursor-not-allowed"
                            : "bg-[#50b4d8] hover:bg-[#3d8098] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01BAFF]"
                    }`}
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Sign up"}
                </button>
            </div>
        </form>
    );
};

// Export the `SignUpForm` component for use in other parts of the application.
export default SignUpForm;
