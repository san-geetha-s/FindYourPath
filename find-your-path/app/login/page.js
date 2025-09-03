"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "../styles/phoneInput.css"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!phone || !password) {
      alert("⚠️ Please enter both phone number and password");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", phone));
      if (!userDoc.exists()) {
        alert("❌ No user found with this phone number.");
        return;
      }

      const userData = userDoc.data();
      const isPasswordValid = await bcrypt.compare(password, userData.password);

      if (!isPasswordValid) {
        alert("❌ Incorrect password.");
        return;
      }

      // ✅ Redirect to welcome page with user’s name
      router.push(`/welcome?name=${encodeURIComponent(userData.name)}`);
    } catch (err) {
      console.error("Login error:", err);
      alert("❌ Something went wrong. Please try again.");
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
          className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Login to Your Account
        </motion.h2>

        <div className="flex flex-col gap-4">
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

          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 mb-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
          />
        </div>

        {/* Login Button */}
        <motion.button
          onClick={handleLogin}
          className="w-full mt-6 p-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 rounded-lg font-semibold text-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </motion.div>
    </div>
  );
}
