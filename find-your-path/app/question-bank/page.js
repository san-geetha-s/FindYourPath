"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

// 60 Questions (same as before, shortened here for clarity)
const questions = {
  R: [
    "Do you enjoy fixing or repairing broken items?",
    "Would you rather spend time outdoors than at a desk?",
    "Do you like working with tools, machines, or equipment?",
    "Do you enjoy building or assembling things?",
    "Would you be interested in a career that involves physical activity?",
    "Do you find satisfaction in solving practical problems?",
    "Do you like learning how mechanical things work?",
    "Would you enjoy farming, gardening, or working with nature?",
    "Do you feel confident doing manual skill tasks?",
    "Do you enjoy operating gadgets, electronics, or devices?",
  ],
  I: [
    "Do you enjoy solving puzzles or brain teasers?",
    "Would you rather experiment to find answers than accept things?",
    "Do you enjoy analyzing data or patterns?",
    "Do you like reading about science, tech, or discoveries?",
    "Would you spend time researching a complex question?",
    "Do you find problem-solving exciting?",
    "Do you enjoy logical reasoning tasks?",
    "Would you design an experiment to test an idea?",
    "Do you prefer exploring why something happens?",
    "Do you enjoy math, coding, or science challenges?",
  ],
  A: [
    "Do you enjoy drawing, painting, or creating visuals?",
    "Do you like writing stories, poems, or blogs?",
    "Would you enjoy designing logos, posters, or websites?",
    "Do you think of unique ways to express ideas?",
    "Do you enjoy music or singing?",
    "Do you feel inspired by art or literature?",
    "Do you enjoy experimenting with design and colors?",
    "Would you like a creative career?",
    "Do you think outside the box to solve problems?",
    "Do you enjoy photography, video editing, or digital art?",
  ],
  S: [
    "Do you enjoy helping others solve problems?",
    "Would you enjoy teaching or tutoring?",
    "Do you like being part of a team?",
    "Do you feel motivated making a positive impact?",
    "Would you work in healthcare, teaching, or service?",
    "Do you enjoy explaining concepts simply?",
    "Do you like listening and understanding issues?",
    "Would you enjoy leading group discussions?",
    "Do you feel energized after social interactions?",
    "Do you enjoy mentoring or guiding others?",
  ],
  E: [
    "Do you enjoy persuading or convincing people?",
    "Would you like to start a business someday?",
    "Do you feel comfortable taking risks?",
    "Do you enjoy planning events or organizing groups?",
    "Do you feel confident making quick decisions?",
    "Would you enjoy sales, management, or politics?",
    "Do you like negotiating deals?",
    "Do you feel motivated by competition?",
    "Would you present your ideas to a large group?",
    "Do you like being a leader?",
  ],
  C: [
    "Do you enjoy organizing files, lists, or schedules?",
    "Would you follow a clear routine instead of improvising?",
    "Do you enjoy working with numbers or financial data?",
    "Do you feel comfortable with repetitive but accurate tasks?",
    "Do you like keeping things neat and orderly?",
    "Would you enjoy banking, accounting, or admin?",
    "Do you feel satisfied completing precise tasks?",
    "Do you prefer rules over experimenting?",
    "Do you enjoy managing spreadsheets or databases?",
    "Do you like following detailed instructions?",
  ],
};

const careerSuggestions = {
  R: ["Engineer", "Technician", "Mechanic", "Farmer", "Architect"],
  I: ["Scientist", "Data Analyst", "Researcher", "Doctor", "Software Developer"],
  A: ["Designer", "Writer", "Artist", "Musician", "Photographer"],
  S: ["Teacher", "Nurse", "Counselor", "Social Worker", "HR Manager"],
  E: ["Entrepreneur", "Manager", "Lawyer", "Sales Executive", "Politician"],
  C: ["Accountant", "Banker", "Administrator", "Auditor", "Data Entry"],
};

export default function QuestionBankPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "User";

  const allQuestions = Object.entries(questions).flatMap(([category, qList]) =>
    qList.map((q, index) => ({ category, text: q, id: `${category}-${index}` }))
  );

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState(0);

  const totalQuestions = allQuestions.length;
  const questionsPerPage = 10;
  const start = page * questionsPerPage;
  const currentQuestions = allQuestions.slice(start, start + questionsPerPage);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const calculateResults = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(answers).forEach(([key, value]) => {
      const [category] = key.split("-");
      if (value === "yes") scores[category] += 1;
      if (value === "neutral") scores[category] += 0.5;
    });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 2).map(([cat]) => cat);
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < totalQuestions) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
  };

  const topTwo = submitted ? calculateResults() : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6">
        <h1 className="text-xl font-bold">📝 Career Interest Test</h1>
        <span className="bg-white/10 px-4 py-2 rounded-lg">👤 {name}</span>
      </header>

      {!submitted ? (
        <main className="flex-1 flex flex-col items-center px-6">
          {/* Progress */}
          <div className="w-full max-w-3xl mb-4">
            <div className="w-full bg-white/20 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                style={{ width: `${(Object.keys(answers).length / totalQuestions) * 100}%` }}
              />
            </div>
            <p className="text-right text-sm mt-1">
              {Object.keys(answers).length} / {totalQuestions} answered
            </p>
          </div>

          {/* Questions */}
          <motion.div
            className="w-full max-w-3xl bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {currentQuestions.map((q) => (
              <div key={q.id} className="mb-6 p-4 rounded-xl bg-white/5 border border-white/20">
                <h2 className="text-md font-medium mb-3">{q.text}</h2>
                <div className="flex gap-3">
                  {["yes", "neutral", "no"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(q.id, option)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                        ${
                          answers[q.id] === option
                            ? option === "yes"
                              ? "bg-green-500 text-white"
                              : option === "neutral"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                            : "bg-white/10 text-gray-200 hover:bg-white/20"
                        }`}
                    >
                      {option === "yes" ? "✅ Yes" : option === "neutral" ? "😐 Neutral" : "❌ No"}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 disabled:opacity-30"
              >
                ⬅ Previous
              </button>
              {page < Math.ceil(totalQuestions / questionsPerPage) - 1 ? (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                >
                  Next ➡
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold"
                >
                  Submit ✅
                </button>
              )}
            </div>
          </motion.div>
        </main>
      ) : (
        <main className="flex-1 flex justify-center items-center">
          <motion.div
            className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold mb-4">🎉 Thank you, {name}!</h2>
            <p className="mb-6">Your top career interests are:</p>
            {topTwo.map((cat) => (
              <p key={cat} className="mb-2">
                {cat} → {careerSuggestions[cat].join(", ")}
              </p>
            ))}
          </motion.div>
        </main>
      )}
    </div>
  );
}
