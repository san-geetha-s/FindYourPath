"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

export default function CongratulationsPage() {
  const router = useRouter();
  const [name, setName] = useState("Student");      // student name
  const [career, setCareer] = useState("Your Career");  // chosen career
  const [reflection, setReflection] = useState("");
  const [showConfetti, setShowConfetti] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // mark client rendering
  useEffect(() => setIsClient(true), []);

  // load name and career from localStorage
  useEffect(() => {
    if (!isClient) return;
    const storedName = localStorage.getItem("studentName") || "Student";
    const storedCareer = localStorage.getItem("career") || "Your Career";

    setName(storedName);
    setCareer(storedCareer);
  }, [isClient]);

  // stop confetti after 6s
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitReflection = () => {
    if (!reflection.trim()) {
      alert("Please write your reflection before submitting.");
      return;
    }
    alert("✅ Reflection submitted successfully!");
    setReflection("");
  };

  const handleShare = () => {
    const shareText = `🎉 I’ve completed my ${career} learning journey on PathFinder! Feeling proud and motivated to keep growing. 🚀 #PathFinder`;
    if (navigator.share) {
      navigator.share({ title: "PathFinder Achievement", text: shareText, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard! You can now share your achievement 🎉");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF("landscape", "pt", "a4");

      const loadImageAsBase64 = (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          img.onerror = reject;
        });

      const imgData = await loadImageAsBase64("/certificate.png");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

      const today = new Date().toLocaleDateString();
      const nameFontSize = name.length > 20 ? 28 : 36;
      const careerFontSize = career.length > 25 ? 20 : 24;

      doc.setFont("Times", "bold");
      doc.setFontSize(nameFontSize);
      doc.text(name, pageWidth / 2, 280, { align: "center" });

      doc.setFontSize(careerFontSize);
      doc.text(career, pageWidth / 2, 350, { align: "center" });

      doc.setFontSize(18);
      doc.text(today, pageWidth / 2, 420, { align: "center" });

      doc.save(`${name}_Certificate.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate certificate. Please try again.");
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-purple-900 text-white flex flex-col items-center justify-center px-6">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      <motion.h1
        className="text-5xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        🎉 Congratulations, {name}!
      </motion.h1>

      <p className="text-lg text-gray-300 text-center max-w-2xl mb-10">
        You’ve successfully completed your <span className="font-semibold text-purple-400">{career}</span> learning
        path and soft skill training. This is the start of your transformation 🚀
      </p>

      <div className="w-full max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg mb-10">
        <h3 className="text-xl font-semibold mb-3 text-purple-300">📝 Write Your Reflection</h3>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full h-28 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
          placeholder="How do you feel after completing this journey?"
        />
        <button
          onClick={handleSubmitReflection}
          className="mt-4 px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-all font-semibold"
        >
          Submit Reflection
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handleDownloadCertificate}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold shadow-lg hover:opacity-90"
        >
          🎓 Download Certificate
        </button>

        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:opacity-90"
        >
          🚀 Start a New Journey
        </button>

        <button
          onClick={handleShare}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90"
        >
          📢 Share Achievement
        </button>
      </div>
    </div>
  );
}
