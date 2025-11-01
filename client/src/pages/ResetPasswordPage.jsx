// ResetPasswordPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) navigate("/auth");
    }, [token, navigate]);

    const validatePassword = (pwd) => {
        const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirm) return toast.error("Passwords do not match");
        if (!validatePassword(newPassword)) return toast.error("Password doesn't meet requirements");

        try {
            setLoading(true);
            await axiosInstance.post(`/auth/reset-password/${token}`, { newPassword });
            toast.success("Password reset successful. Please login.");
            navigate("/auth");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D617A] to-[#3d8098] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-center text-2xl font-semibold mb-4">Reset Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#01BAFF]"
                    />
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirm password"
                        required
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#01BAFF]"
                    />
                    <div className="flex justify-end">
                        <button disabled={loading} className="bg-[#50b4d8] text-white px-4 py-2 rounded-md">
                            {loading ? "Saving..." : "Save Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
