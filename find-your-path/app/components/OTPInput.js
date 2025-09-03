"use client";

import { useRef } from "react";

export default function OTPInput({ otp, setOtp, length = 6 }) {
  const inputs = useRef([]);

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
    const newOtp = otp.split("");
    newOtp[idx] = value;
    setOtp(newOtp.join(""));

    if (value && idx < length - 1) {
      inputs.current[idx + 1].focus(); // move to next input
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1].focus(); // move back if empty
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, length);
    const newOtp = paste.split("").filter((ch) => /\d/.test(ch));
    setOtp(newOtp.join(""));
    newOtp.forEach((num, i) => {
      if (inputs.current[i]) inputs.current[i].value = num;
    });
  };

  return (
    <div
      className="flex justify-between gap-2"
      onPaste={handlePaste}
    >
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          maxLength="1"
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        />
      ))}
    </div>
  );
}
