"use client"; // ✅ Must be the very first line

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import DailySkillTracker from "../components/DailySkillTracker";

export default function LearningPathPage() {
  const searchParams = useSearchParams();
  const careerParam = searchParams.get("career");
  const [career, setCareer] = useState(careerParam);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({}); // ✅ Track completed items
const chosenSkill = "communication"; 
  // Fetch chosen career from Firebase if not in URL
  useEffect(() => {
    const fetchCareer = async () => {
      if (!career) {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "users", user.phoneNumber);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCareer(snap.data().chosenCareer);
        }
      }
    };
    fetchCareer();
  }, [career]);

  // Load progress from localStorage
  useEffect(() => {
    if (!career) return;
    const saved = localStorage.getItem(`progress-${career}`);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, [career]);

  // Save progress to localStorage
  useEffect(() => {
    if (career) {
      localStorage.setItem(`progress-${career}`, JSON.stringify(progress));
    }
  }, [progress, career]);

  // Fetch resources from API
  useEffect(() => {
    if (!career) return;

    const fetchResources = async () => {
      try {
        const res = await fetch(
          `/api/resources?career=${encodeURIComponent(career)}`
        );
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        setResources(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [career]);

  if (!career) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Please choose a career first.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading resources for {career}...
      </div>
    );
  }

  if (!resources) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        No resources found for {career}.
      </div>
    );
  }

  // ✅ Handle toggle of completed items
  const toggleComplete = (section, idx) => {
    setProgress((prev) => {
      const sectionProgress = prev[section] || [];
      const newProgress = sectionProgress.includes(idx)
        ? sectionProgress.filter((i) => i !== idx) // remove if already completed
        : [...sectionProgress, idx]; // add if not completed
      return { ...prev, [section]: newProgress };
    });
  };

  // Render section with modern card UI + progress bar
  const renderSection = (title, key, items, getLink, getSubtitle) => {
    const completedCount = progress[key]?.length || 0;
    const totalCount = items?.length || 0;
    const percentage = totalCount
      ? Math.round((completedCount / totalCount) * 100)
      : 0;

    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-2 border-b-2 border-purple-500 pb-2">
          {title}
        </h2>

        {/* ✅ Progress Bar */}
        {totalCount > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
            <div
              className="bg-purple-500 h-3 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        )}

        {items && items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item, idx) => {
              const isCompleted = progress[key]?.includes(idx);
              return (
                <motion.div
                  key={idx}
                  className={`flex flex-col p-5 rounded-2xl shadow-xl border transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-br from-green-700 to-green-900 border-green-600"
                      : "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <a
                    href={getLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-white">
                      {item.title}
                    </h3>
                    {getSubtitle && (
                      <p className="text-sm text-gray-400">
                        {getSubtitle(item)}
                      </p>
                    )}
                  </a>
                  {/* ✅ Checkbox to mark as complete */}
                  <label className="mt-4 flex items-center space-x-2 cursor-pointer">
                   <input
  type="checkbox"
  checked={!!isCompleted}   // ✅ always true/false
  onChange={() => toggleComplete(key, idx)}
  className="w-4 h-4 accent-purple-500"
/>

                    <span className="text-xs text-gray-300">
                      {isCompleted ? "Completed" : "Mark as Complete"}
                    </span>
                  </label>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No resources available.</p>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        🚀 Personalized Learning Path for {career}
      </h1>

      {renderSection(
        "Audiobooks",
        "audiobooks",
        resources.audiobooks,
        (a) => a.url,
        (a) => `Channel: ${a.channel || "Unknown"}`
      )}
      {renderSection(
        "YouTube Videos",
        "youtube",
        resources.youtube,
        (v) => v.url,
        (v) => `Channel: ${v.channel || "Unknown"}`
      )}
      {renderSection("Courses", "courses", resources.courses, (c) => c.link, (c) => c.provider)}
      {renderSection("Articles", "articles", resources.articles, (a) => a.link, (a) => a.source)}
      <div className="mt-12">
      <DailySkillTracker chosenSkill={career} />
    </div>
    </div>
  );
}
