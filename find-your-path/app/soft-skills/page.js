"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SoftSkillsPage() {
  const router = useRouter();

  // ✅ State for user info and progress
  const [name, setName] = useState("Student");
  const [career, setCareer] = useState("");
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState({}); 
  const [loading, setLoading] = useState(true);

  // Generic soft skill prompts
  const genericTasks = [
    "Record a 1-minute video introducing yourself and your goals, then note how confident you felt.",
    "Reach out to someone (mentor, peer, elder), and ask one open question — reflect on the response.",
    "Watch a short TED talk on communication — write one takeaway and one action you’ll try tomorrow.",
    "Spend 10 mins observing conversations around you; note body language and how you’d respond differently.",
    "Write three personal strengths and three areas you want to improve — set one micro-goal.",
    "Give someone constructive praise today, notice their reaction and how it made you feel.",
    "Explain a concept you recently learned to someone (in simple terms), reflect on clarity.",
    "Silently observe your thoughts during a 5-minute walk; write what surprised you.",
    "Plan your next day in advance — set three small “soft skill” actions you’ll do.",
    "Write a reflection on how you deal with criticism; recall one past event and what you'd change."
  ];

  // Career-specific prompts
  const careerTasks = {
    Entrepreneur: [
      "Draft a one-paragraph pitch of your business idea and send it to someone for feedback.",
      "Identify three potential collaborators or customers and message one of them.",
      "Reflect on a past failure: what was the lesson, and how will you act differently next time?",
      "Record your ideal day in your future career; list habits you need to adopt.",
      "Make a mini test or experiment (e.g. create a landing page or try small sale) and reflect on results."
    ],
    "Software Developer": [
      "Pick a concept you struggled with; teach it in writing to a non-technical person and reflect.",
      "Search for an open-source repo; read code and write one suggestion or question you have.",
      "Build a “mini challenge” (small feature) in 30 mins; reflect on hurdles and solutions.",
      "Write a short blog summary of something you learned this week, post it or share with someone.",
      "Explain a bug you encountered recently to someone, reflecting on debugging steps."
    ],
    Teacher: [
      "Prepare a short (2–3 minute) lesson on a non-academic topic, record yourself teaching it.",
      "Ask a peer or student for feedback on your communication or clarity.",
      "Observe a lecture or teaching video; note 3 techniques you’ll adopt.",
      "Design one active learning activity and test it with someone; reflect on results.",
      "Write a lesson reflection: what went well, what to improve, what surprised you."
    ],
  };

  // ✅ Load name, career, tasks, and progress once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("studentName") || "Student";
      const storedCareer = localStorage.getItem("career") || "";

      setName(storedName);
      setCareer(storedCareer);

      const combinedTasks = [...genericTasks, ...(careerTasks[storedCareer] || [])];
      setTasks(combinedTasks);

      const savedProgress = localStorage.getItem(`softskills-progress-${storedCareer}`);
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch {
          setProgress({});
        }
      }

      setLoading(false);
    }
  }, []);

  // ✅ Save progress to localStorage whenever it changes
  useEffect(() => {
    if (career) {
      localStorage.setItem(`softskills-progress-${career}`, JSON.stringify(progress));
    }
  }, [progress, career]);

  // ✅ Redirect to Congratulations page when all tasks are done
  useEffect(() => {
    if (tasks.length === 0) return;
    const allDone = tasks.every((_, idx) => progress[idx]?.done);
    if (allDone) {
      setTimeout(() => {
        router.push(
          `/congratulations?career=${encodeURIComponent(career)}&name=${encodeURIComponent(name)}`
        );
      }, 1200);
    }
  }, [progress, tasks, router, career, name]);

  const canToggle = (idx) => idx === 0 || progress[idx - 1]?.done;

  const handleMarkDone = (idx) => {
    const entry = progress[idx] || {};
    if (!entry.reflection || entry.reflection.trim() === "") {
      alert("Please write your reflection before marking complete");
      return;
    }
    setProgress((prev) => ({
      ...prev,
      [idx]: { ...entry, done: true },
    }));
  };

  const handleReflectionChange = (idx, text) => {
    setProgress((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] || {}), reflection: text },
    }));
  };

  if (!career) return <div className="flex items-center justify-center min-h-screen text-white">No career selected.</div>;
  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading soft skill training...</div>;

  const completedCount = tasks.filter((_, idx) => progress[idx]?.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Soft Skills Training for {career} — {name}
      </h1>

      <div className="w-full bg-gray-700 rounded-full h-3 mb-8">
        <div
          className="bg-green-500 h-3 rounded-full"
          style={{ width: `${(completedCount / tasks.length) * 100}%` }}
        />
      </div>

      <div className="space-y-8">
        {tasks.map((task, idx) => {
          const entry = progress[idx] || {};
          const done = entry.done;
          const reflectionText = entry.reflection || "";
          return (
            <motion.div
              key={idx}
              className={`p-6 bg-gray-800 rounded-2xl shadow-lg border ${done ? "border-green-500 bg-gradient-to-br from-green-800 to-green-900" : "border-gray-700"}`}
              whileHover={{ scale: canToggle(idx) ? 1.02 : 1 }}
            >
              <h2 className="text-lg font-semibold mb-2">{`Task ${idx + 1}`}</h2>
              <p className="mb-4">{task}</p>

              <textarea
                placeholder="Write your reflection..."
                className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4 resize-none"
                rows={3}
                value={reflectionText}
                onChange={(e) => handleReflectionChange(idx, e.target.value)}
                disabled={!canToggle(idx) || done}
              />

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleMarkDone(idx)}
                  disabled={!canToggle(idx) || done}
                  className={`px-5 py-2 rounded-lg font-semibold transition ${
                    done
                      ? "bg-green-500 text-white"
                      : canToggle(idx)
                      ? "bg-purple-500 text-white hover:bg-purple-600"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {done ? "Completed" : "Mark as Complete"}
                </button>
                <span className="text-sm text-gray-400">{done ? "✅" : `Task ${idx + 1} of ${tasks.length}`}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
