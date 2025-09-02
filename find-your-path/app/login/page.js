"use client";
import { useState } from "react";


export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
    if (phone.trim() === "") return alert("Enter phone number");
    // Normally, you'd call a backend / API here
    setOtpSent(true);
    alert("OTP sent (demo)");
  };

  const handleVerifyOtp = () => {
    if (otp === "1234") {
      alert("✅ Login Successful");
    } else {
      alert("❌ Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login / Signup
        </h1>

        {!otpSent ? (
          <>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
