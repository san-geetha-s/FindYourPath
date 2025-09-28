"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Sample practical tasks per career
const sampleTasks = {
  Entrepreneur: [
    "Talk to a stranger today",
    "Start a small side project",
    "Write a short plan for a business idea",
    "Record a 1-minute video about your goal",
    "Learn one new skill online",
  ],
  "Software Developer": [
    "Solve one coding problem",
    "Watch a tutorial on React",
    "Build a small component",
    "Read one programming article",
    "Write a function from scratch",
  ],
  "Teacher": [
    "Teach a small concept to someone",
    "Prepare a 5-min lesson plan",
    "Observe a teaching video online",
    "Write a reflection on communication",
    "Give feedback to a peer",
  ],
  // Add more careers as needed
};

export default function DailySkillTracker({ chosenSkill }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!chosenSkill || !sampleTasks[chosenSkill]) return;

    const randomTasks = [...sampleTasks[chosenSkill]]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    setTasks(randomTasks);
  }, [chosenSkill]);

  if (!tasks.length) return null;

  return (
    <div className="mb-10 p-6 bg-gradient-to-r from-purple-700 to-pink-600 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-white">
        🔥 Your Daily Practical Tasks
      </h2>
      <ul className="space-y-3">
        {tasks.map((task, idx) => (
          <motion.li
            key={idx}
            className="p-3 bg-white/10 rounded-lg shadow hover:bg-white/20 transition text-white"
            whileHover={{ scale: 1.03 }}
          >
            {task}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
