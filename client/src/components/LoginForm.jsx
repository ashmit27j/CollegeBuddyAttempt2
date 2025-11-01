// Import necessary libraries and components.
// `useState` is a React hook for managing local state.
// `useAuthStore` is a Zustand store for managing authentication-related actions and state.
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import toast from "react-hot-toast";

const LoginForm = () => {
    // State variables:
    // `email`: Stores the user's email input.
    // `password`: Stores the user's password input.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    // Access the `login` action and `loading` state from the `useAuthStore`.
    const { login, loading } = useAuthStore();

    // Function: Handles password reset link generation.
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) return toast.error("Please enter your email");
        try {
            const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
                email: resetEmail,
            });
            toast.success("Reset link generated! Check console (demo mode).");
            console.log("🔗 Reset Link:", res.data.resetLink);
            setShowForgot(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending reset link");
        }
    };

    return (
        <>
            {/* Main login form */}
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    login({ email, password });
                }}
            >
                {/* Email input field */}
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
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm"
                        />
                    </div>
                </div>

                {/* Password input field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm"
                        />
                    </div>
                    {/* Forgot password link */}
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            onClick={() => setShowForgot(true)}
                            className="text-sm text-[#1D617A] hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent 
                        rounded-md shadow-sm text-sm font-medium text-white ${
                            loading
                                ? "bg-[#01BAFF80] cursor-not-allowed"
                                : "bg-[#50b4d8] hover:bg-[#50b4d8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01BAFF]"
                        }`}
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            {/* Forgot password modal */}
            {showForgot && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-80 relative">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">
                            Reset Password
                        </h3>
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] text-sm"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForgot(false)}
                                    className="text-gray-600 text-sm hover:underline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#50b4d8] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#3d8098]"
                                >
                                    Send Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default LoginForm;
