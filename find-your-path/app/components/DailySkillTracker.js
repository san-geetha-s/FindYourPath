"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DailySoftSkills({ career }) {
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!career) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`/api/softskills?career=${career}`);
        const data = await res.json();
        setTasks([...data.genericTasks, ...data.careerTasks]);
      } catch (err) {
        console.error("Failed to fetch soft skills tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [career]);

  const toggleComplete = (idx) => {
    setCompleted((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (loading) return <p className="text-gray-400">Loading soft skills...</p>;
  if (!tasks.length) return <p className="text-gray-400">No tasks defined for this career.</p>;

  return (
    <div className="p-6 bg-gradient-to-r from-purple-700 to-pink-600 rounded-2xl shadow-xl mb-10">
      <h2 className="text-2xl font-bold mb-4 text-white">
        🌟 Daily Soft Skills Tasks for {career}
      </h2>
      <ul className="space-y-3">
        {tasks.map((task, idx) => (
          <motion.li
            key={idx}
            className={`p-3 rounded-lg shadow cursor-pointer transition ${
              completed.includes(idx)
                ? "bg-green-700/70 text-white line-through"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            onClick={() => toggleComplete(idx)}
            whileHover={{ scale: 1.03 }}
          >
            {task}
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-300">
        {completed.length} of {tasks.length} tasks completed
      </p>
    </div>
  );
}
