// VerifyOtpPage.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const VerifyOtpPage = () => {
    const [searchParams] = useSearchParams();
    const emailFromQuery = searchParams.get("email") || "";
    const [email, setEmail] = useState(emailFromQuery);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const navigate = useNavigate();
    const { setAuthUser } = useAuthStore();

    useEffect(() => {
        if (!emailFromQuery) {
            // if no email, redirect to auth
            navigate("/auth");
        }
    }, [emailFromQuery, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) return toast.error("Enter 6-digit OTP");
        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
            toast.success("Email verified — logged in");
            // update auth store
            if (res.data && res.data.user) {
                setAuthUser(res.data.user);
            }
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            setResendLoading(true);
            await axiosInstance.post("/auth/resend-otp", { email });
            toast.success("OTP resent to email");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend OTP");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1D617A] to-[#3d8098] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-center text-2xl font-semibold mb-4">Verify your email</h2>
                <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <strong>{email}</strong></p>

                <form onSubmit={handleVerify} className="space-y-4">
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="Enter 6-digit code"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-[#01BAFF]"
                    />

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="text-sm text-[#1D617A] hover:underline"
                        >
                            {resendLoading ? "Resending..." : "Resend code"}
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#50b4d8] text-white px-4 py-2 rounded-md"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
