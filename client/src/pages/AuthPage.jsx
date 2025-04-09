// Import necessary libraries and components.
// `useState` is a React hook for managing local state.
// `LoginForm` and `SignUpForm` are components for user authentication.
import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

const AuthPage = () => {
    // State variable:
    // `isLogin`: Determines whether the login form or the signup form is displayed.
    const [isLogin, setIsLogin] = useState(true);

    return (
			// Main container for the authentication page with a gradient background.
			<div
				className="min-h-screen flex items-center justify-center bg-gradient-to-br
        from-[#1D617A] to-[#3d8098] p-4"
			>
				{/* Container for the authentication form. */}
				<div className="w-full max-w-md">
					{/* Page title that dynamically changes based on the form being displayed. */}
					<h2 className="text-center text-3xl font-bold text-white mb-8">
						{isLogin ? "Sign in" : "Create Account"}
					</h2>

					{/* Form container with a shadow and rounded corners. */}
					<div className="bg-white shadow-xl rounded-2xl p-8">
						{/* Render the login form or signup form based on the `isLogin` state. */}
						{isLogin ? <LoginForm /> : <SignUpForm />}

						{/* Toggle between login and signup forms. */}
						<div className="flex justify-center">
							<div className="mt-5 text-center inline-flex justify-center align-middle gap-1">
								<p className="text-sm text-gray-600 mt-[3px]">
									{isLogin
										? "New to CollegeBuddy?"
										: "Already have an account?"}
								</p>

								{/* Button to toggle the `isLogin` state. */}
								<button
									onClick={() => setIsLogin((prevIsLogin) => !prevIsLogin)}
									className=" text-[#1D617A] font-medium transition-colors duration-300"
								>
									{isLogin ? "Create a new account" : "Sign in to your account"}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
};

export default AuthPage;
