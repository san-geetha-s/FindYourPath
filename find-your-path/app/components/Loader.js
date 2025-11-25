"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white z-[9999]">
      {/* Outer glow ring */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-30 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Logo or App Name */}
      <motion.h1
        className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        PathFinder
      </motion.h1>

      {/* Shimmer underline */}
      <motion.div
        className="w-36 h-[2px] mt-4 bg-gradient-to-r from-transparent via-purple-500 to-transparent"
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtitle */}
      <motion.p
        className="text-gray-300 mt-4 text-lg italic"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Empowering your growth journey 🚀
      </motion.p>

      {/* Rotating ring */}
      <motion.div
        className="absolute w-52 h-52 border-t-4 border-purple-500 rounded-full mt-4 opacity-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
