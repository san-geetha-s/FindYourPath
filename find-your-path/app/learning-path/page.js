"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../components/Loader";
// Motivational Quotes Data
const motivationalQuotes = [
  "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "Don’t watch the clock; do what it does. Keep going. – Sam Levenson",
  "The secret of getting ahead is getting started. – Mark Twain",
  "It always seems impossible until it’s done. – Nelson Mandela",
  "Hardships often prepare ordinary people for an extraordinary destiny. – C.S. Lewis",
  "Do one thing every day that scares you. – Eleanor Roosevelt",
  "Opportunities don't happen, you create them. – Chris Grosser",
  "Act as if what you do makes a difference. It does. – William James",
  "Dream big and dare to fail. – Norman Vaughan",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
];

export default function LearningPathPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const careerParam = searchParams.get("career");
  const [career, setCareer] = useState(careerParam);
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [quote, setQuote] = useState("");

  // Fetch chosen career from Firebase if not in URL
  useEffect(() => {
    const fetchCareer = async () => {
      if (!career) {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, "users", user.phoneNumber);
        const snap = await getDoc(ref);
        if (snap.exists()) setCareer(snap.data().chosenCareer);
      }
    };
    fetchCareer();
  }, [career]);

  // Pick a random motivational quote
  useEffect(() => {
    const randomQuote =
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);
  }, []);

  // Load progress from localStorage
  useEffect(() => {
    if (!career) return;
    const savedProgress = localStorage.getItem(`progress-${career}`);
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, [career]);

  // Save progress
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
        console.error(err);
        setResources(null);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [career]);

  if (!career)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Please choose a career first.
      </div>
    );
  if (loading)
    // return (
    //   <div className="flex items-center justify-center min-h-screen text-white">
    //     Loading resources for {career}...
       
    //   </div>
    // );
    return <Loader/>

  if (!resources)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        No resources found for {career}.
      </div>
    );

  // Toggle completed items
  const toggleComplete = (section, idx) => {
    setProgress((prev) => {
      const sectionProgress = prev[section] || [];
      const newProgress = sectionProgress.includes(idx)
        ? sectionProgress.filter((i) => i !== idx)
        : [...sectionProgress, idx];
      return { ...prev, [section]: newProgress };
    });
  };

  // Check if all resources are completed
  const allCompleted = Object.keys(resources).every((key) => {
    const total = resources[key]?.length || 0;
    const done = progress[key]?.length || 0;
    return total === done;
  });

  // Proceed to Soft Skills page
  const handleProceed = () => {
    if (allCompleted) {
      router.push(`/soft-skills?career=${encodeURIComponent(career)}`);
    }
  };

  // Render resources section
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
                  <label className="mt-4 flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!isCompleted}
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

      {/* ✅ Motivational Quote Card */}
      {quote && (
        <div className="mb-10 p-6 bg-gradient-to-r from-purple-700 to-pink-600 rounded-2xl shadow-xl text-center">
          <span className="text-white italic font-medium">“{quote}”</span>
        </div>
      )}

      {/* Render all resource sections */}
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
      {renderSection(
        "Courses",
        "courses",
        resources.courses,
        (c) => c.link,
        (c) => c.provider
      )}
      {renderSection(
        "Articles",
        "articles",
        resources.articles,
        (a) => a.link,
        (a) => a.source
      )}

      {/* ✅ Proceed Button */}
      <div className="flex justify-end mt-12">
        <button
          onClick={handleProceed}
          disabled={!allCompleted}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            allCompleted
              ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          Proceed to Soft Skills
        </button>
      </div>
    </div>
  );
}
