"use client";

import { useState, useEffect } from "react";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app, db } from "../../lib/firebase"; // your Firebase config
import { doc, setDoc } from "firebase/firestore";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import OTPInput from "../components/OTPInput"; // your OTP component
import bcrypt from "bcryptjs";

const auth = getAuth(app);

export default function SignupPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [career, setCareer] = useState(""); // user chooses career
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && auth.settings) {
      try {
        auth.settings.appVerificationDisabledForTesting = true;
      } catch (err) {
        console.warn(err);
      }
    }
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
    }
  };

  const sendOTP = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    if (!phone.startsWith("+")) return alert("❌ Invalid number format");

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmationResult;
      setIsOTPSent(true);
      alert("✅ OTP sent");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP");
    }
  };

// Inside verifyOTP()
const verifyOTP = async () => {
  try {
    const confirmationResult = window.confirmationResult;
    await confirmationResult.confirm(otp);

    const hashedPassword = await bcrypt.hash(password, 10);

    await setDoc(doc(db, "users", phone), {
      name,
      phone,
      password: hashedPassword,
    });

    // Save name and career for flow
    if (typeof window !== "undefined") {
      localStorage.setItem("username", name);
      localStorage.setItem("career", career || "Your Career"); // make sure career is selected before
    }

    router.push("/welcome");
  } catch (error) {
    console.error("OTP verification error:", error);
    alert("❌ Invalid OTP, please try again");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white">
      <motion.div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
          Signup
        </h2>

        {!isOTPSent && (
          <>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 mb-4 rounded-lg bg-white/20" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 mb-4 rounded-lg bg-white/20" />

            <select value={career} onChange={e => setCareer(e.target.value)} className="w-full p-3 mb-4 rounded-lg bg-white/20">
              <option value="">Select Career</option>
              <option value="Entrepreneur">Entrepreneur</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Teacher">Teacher</option>
            </select>

            <PhoneInput country="in" value={phone} onChange={val => setPhone("+" + val)} />

            <button onClick={sendOTP} className="w-full mt-4 p-3 bg-purple-500 rounded-lg">
              Send OTP
            </button>
          </>
        )}

        {isOTPSent && (
          <>
            <OTPInput otp={otp} setOtp={setOtp} length={6} />
            <button onClick={verifyOTP} className="w-full mt-4 p-3 bg-green-500 rounded-lg">
              Verify OTP
            </button>
          </>
        )}
        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
