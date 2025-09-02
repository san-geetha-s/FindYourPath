"use client";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-5xl font-bold text-white mb-6"
      >
        Ready to Discover Your True Path?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8"
      >
        Take the first step today and unlock a future built around your passions and skills.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <a href="/login">
          <button className="px-10 py-4 rounded-full bg-white text-pink-600 font-semibold text-lg shadow-lg hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </a>
      </motion.div>
    </section>
  );
}
