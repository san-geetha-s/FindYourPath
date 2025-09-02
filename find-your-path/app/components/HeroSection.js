"use client";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-center px-6 pt-24">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-white mb-6"
      >
        Discover Your True Path 🚀
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-white/90 max-w-2xl mb-8"
      >
        An intelligent platform to help you uncover your interests, skills, and the future you’re meant to build.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="flex gap-4"
      >
        <a
          href="/signup"
          className="px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-lg hover:bg-pink-600 transition-colors shadow-lg"
        >
          Sign Up
        </a>
        <a
          href="/login"
          className="px-6 py-3 rounded-full bg-white text-pink-600 font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Login
        </a>
      </motion.div>
    </section>
  );
}
