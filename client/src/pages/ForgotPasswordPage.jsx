// ForgotPasswordPage.jsx
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/forgot-password", { email });
            toast.success("Reset link sent to email (check inbox).");
            // optionally navigate to a page showing instructions
            navigate("/auth");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D617A] to-[#3d8098] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-center text-2xl font-semibold mb-4">Forgot Password</h2>
                <p className="text-sm text-gray-600 mb-4">Enter your registered email to receive a reset link.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#01BAFF]"
                    />
                    <div className="flex justify-end">
                        <button className="bg-[#50b4d8] text-white px-4 py-2 rounded-md" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
