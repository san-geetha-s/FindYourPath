"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Guest";
  const { width, height } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 🌈 Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* 🎉 Confetti */}
      {mounted && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      {/* ✨ Glassy Welcome Card */}
      <motion.div
        className="relative text-center p-10 rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 z-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-4 text-white drop-shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          🎉 Hello, {name}!
        </motion.h1>
        <p className="text-xl text-white/90">
          We’re so happy to have you here 🚀
        </p>
      </motion.div>
    </motion.div>
  );
}
