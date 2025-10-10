"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useEffect } from "react";

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "User";
  const { width, height } = useWindowSize();
  const router = useRouter();

  // ⏳ Redirect after 5 seconds
  useEffect(() => {
    // Store name in localStorage so other pages can access
    localStorage.setItem("studentName", name);

    const timer = setTimeout(() => {
      router.push(`/question-bank?name=${encodeURIComponent(name)}`);
    }, 5000);
    return () => clearTimeout(timer);
  }, [name, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-400 via-emerald-600 to-teal-900 text-white relative overflow-hidden">
      <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />

      <motion.div
        className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold mb-4">
          🎉 Welcome, {name}!
        </h1>
        <p className="text-lg">We’re setting things up for you...</p>
      </motion.div>
    </div>
  );
}
