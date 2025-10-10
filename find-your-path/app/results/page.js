"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const careerSuggestions = {
  R: ["Engineer", "Technician", "Mechanic", "Farmer", "Architect"],
  I: ["Scientist", "Data Analyst", "Researcher", "Doctor", "Software Developer"],
  A: ["Designer", "Writer", "Artist", "Musician", "Photographer"],
  S: ["Teacher", "Nurse", "Counselor", "Social Worker", "HR Manager"],
  E: ["Entrepreneur", "Manager", "Lawyer", "Sales Executive", "Politician"],
  C: ["Accountant", "Banker", "Administrator", "Auditor", "Data Entry"],
};

const categoryNames = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export default function ResultsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [studentName, setStudentName] = useState("Student"); // ✅ Use this instead of user.displayName
  const [scores, setScores] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("results"); // results | answers

  // Load student name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    if (storedName) setStudentName(storedName);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      try {
        const ref = doc(db, "users", currentUser.phoneNumber);
        const snap = await getDoc(ref);

        if (!snap.exists() || !snap.data().submitted) {
          router.push("/question-bank");
          return;
        }

        const data = snap.data();
        const userAnswers = data.answers || {};

        const cats = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        Object.entries(userAnswers).forEach(([key, value]) => {
          const [cat] = key.split("-");
          if (!cats.hasOwnProperty(cat)) return;
          if (value === "yes") cats[cat] += 1;
          else if (value === "neutral") cats[cat] += 0.5;
        });

        setScores(cats);
        setAnswers(userAnswers);
        setLoading(false);
      } catch (err) {
        console.error("Failed fetching results:", err);
        router.push("/question-bank");
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading results...
      </div>
    );
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topTwo = sorted.slice(0, 2);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">📊 Dashboard</h2>
        <button
          onClick={() => setView("results")}
          className={`text-left mb-4 px-4 py-2 rounded-lg ${
            view === "results"
              ? "bg-purple-600 text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          Results
        </button>
        <button
          onClick={() => setView("answers")}
          className={`text-left px-4 py-2 rounded-lg ${
            view === "answers"
              ? "bg-purple-600 text-white"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          How You Answered
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {view === "results" && (
          <motion.div
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* ✅ Use studentName from localStorage */}
            <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Hello, {studentName}!
            </h1>
            <p className="mb-8 text-gray-300">
              Here’s a summary of your career interest results based on the
              Holland RIASEC model.
            </p>

            {/* Scores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {Object.entries(scores).map(([cat, score]) => (
                <div key={cat}>
                  <p className="font-medium mb-2">
                    {categoryNames[cat]} ({cat})
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-5 overflow-hidden">
                    <motion.div
                      className="h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${(score / 10) * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(score / 10) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{score} / 10</p>
                </div>
              ))}
            </div>

            {/* Top matches */}
            <h2 className="text-2xl font-semibold mb-4">Your Top Matches</h2>
            {topTwo.map(([cat]) => (
              <div
                key={cat}
                className="mb-4 p-4 rounded-xl bg-white/5 border border-white/20"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {categoryNames[cat]} ({cat})
                </h3>
                <p className="text-gray-300">
                  Suggested careers:{" "}
                  <span className="text-white font-medium">
                    {careerSuggestions[cat].join(", ")}
                  </span>
                </p>
              </div>
            ))}

            {/* Next Button */}
            <div className="flex justify-end mt-8">
              <motion.button
                onClick={() => router.push("/career-options")}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-lg hover:opacity-90 shadow-xl"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Next ➡
              </motion.button>
            </div>
          </motion.div>
        )}

        {view === "answers" && (
          <motion.div
            className="max-w-3xl mx-auto bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-6">How You Answered</h2>
            <ul className="space-y-4">
              {Object.entries(answers).map(([qId, ans]) => (
                <li
                  key={qId}
                  className="p-4 rounded-lg bg-white/5 border border-white/20"
                >
                  <p className="font-medium">{qId}</p>
                  <p className="text-gray-300">Answer: {ans}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  );
}
