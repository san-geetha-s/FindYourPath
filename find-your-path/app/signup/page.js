"use client";

import { useState, useEffect } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app } from "../../lib/firebase";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/phoneInput.css"; // custom styles
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OTPInput from "../components/OTPInput"; // ✅ OTP input
import bcrypt from "bcryptjs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";


const auth = getAuth(app);

export default function SignupPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); // ✅ new password state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && auth.settings) {
      try {
        auth.settings.appVerificationDisabledForTesting = true;
      } catch (err) {
        console.warn("⚠️ Could not disable reCAPTCHA", err);
      }
    }
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const sendOTP = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    if (!phone.startsWith("+")) {
      alert("❌ Invalid number format");
      return;
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOTPSent(true);
      alert("✅ OTP sent");
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      alert("Failed to send OTP");
    }
  };

 const verifyOTP = async () => {
  try {
    const confirmationResult = window.confirmationResult;
    await confirmationResult.confirm(otp);

    // 🔑 Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user in Firestore (use phone as unique ID)
    await setDoc(doc(db, "users", phone), {
      name,
      phone,
      password: hashedPassword,
    });

    // Redirect to welcome page
    router.push(`/welcome?name=${encodeURIComponent(name)}`);
  } catch (error) {
    console.error("OTP verification error:", error);
    alert("❌ Invalid OTP, please try again");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white">
      <motion.div
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Signup with Phone
        </motion.h2>

        {!isOTPSent && (
          <>
            {/* Name Input */}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
            />

            {/* ✅ Password Input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
            />

            {/* Phone Input */}
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={(value) => setPhone("+" + value)}
              inputStyle={{
                width: "100%",
                height: "50px",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "10px",
                fontSize: "16px",
                paddingLeft: "50px",
              }}
              buttonStyle={{
                borderRadius: "10px 0 0 10px",
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "none",
              }}
              dropdownStyle={{
                backgroundColor: "#1f1f1f",
                color: "#fff",
              }}
            />

            <motion.button
              onClick={sendOTP}
              className="w-full mt-6 p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 rounded-lg font-semibold text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send OTP
            </motion.button>
          </>
        )}

        {isOTPSent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {/* ✅ OTP Input Component */}
            <OTPInput otp={otp} setOtp={setOtp} length={6} />

            <motion.button
              onClick={verifyOTP}
              className="w-full mt-6 p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 rounded-lg font-semibold text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Verify OTP
            </motion.button>
          </motion.div>
        )}

        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
