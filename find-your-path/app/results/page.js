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
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("results");

  // Load user & answers
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
          setScores(null);
          setLoading(false);
          return;
        }

        const data = snap.data();
        const answers = data.answers || {};

        // Compute RIASEC scores
        const cats = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        Object.entries(answers).forEach(([key, value]) => {
          const [cat] = key.split("-");
          if (!cats.hasOwnProperty(cat)) return;
          if (value === "yes") cats[cat] += 1;
          else if (value === "neutral") cats[cat] += 0.5;
        });

        setScores(cats);
        setLoading(false);
      } catch (err) {
        console.error("Failed fetching results:", err);
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  // sorted top two
  const sorted = scores
    ? Object.entries(scores).sort((a, b) => b[1] - a[1])
    : [];
  const topTwo = sorted.slice(0, 2);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/40 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8">📊 Dashboard</h2>
        <button
          onClick={() => setActiveTab("results")}
          disabled={!scores}
          className={`mb-4 px-4 py-2 rounded-lg text-left transition-all ${
            activeTab === "results"
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-white/10 hover:bg-white/20 text-gray-300"
          } ${!scores ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          Results
        </button>
        <button
          onClick={() => router.push("/question-bank")}
          className="px-4 py-2 rounded-lg text-left bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
        >
          Retake Test
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "results" && scores ? (
          <motion.div
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                Career Interest Report
              </h1>
              <div className="text-right text-sm text-gray-300">
                <p>👤 {user?.displayName || user?.phoneNumber}</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Scores */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Category Scores</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(scores).map(([cat, score]) => (
                  <div key={cat} className="text-left">
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
            </section>

            {/* Top Careers */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Top Career Matches</h2>
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
            </section>
          </motion.div>
        ) : (
          <div className="text-center text-gray-400">
            {scores
              ? "Select an option from the sidebar."
              : "No results found. Please take the test first."}
          </div>
        )}
      </main>
    </div>
  );
}
