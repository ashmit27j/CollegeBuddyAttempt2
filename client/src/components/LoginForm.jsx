// Import necessary libraries and components.
// `useState` is a React hook for managing local state.
// `useAuthStore` is a Zustand store for managing authentication-related actions and state.
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LoginForm = () => {
    // State variables:
    // `email`: Stores the user's email input.
    // `password`: Stores the user's password input.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Access the `login` action and `loading` state from the `useAuthStore`.
    const { login, loading } = useAuthStore();

    return (
        // Form container:
        // Handles the `onSubmit` event to call the `login` action with the form data.
        <form
            className='space-y-6'
            onSubmit={(e) => {
                e.preventDefault();
                login({ email, password });
            }}
        >
            {/* Email input field */}
            <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                    Email address
                </label>
                <div className='mt-1'>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm'
                    />
                </div>
            </div>

            {/* Password input field */}
            <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                    Password
                </label>
                <div className='mt-1'>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#01BAFF] focus:border-[#01BAFF] sm:text-sm'
                    />
                </div>
            </div>

            {/* Submit button */}
            <button
                type='submit'
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
    );
};

export default LoginForm;
