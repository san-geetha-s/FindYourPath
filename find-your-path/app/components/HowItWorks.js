"use client";
import { motion } from "framer-motion";
import { Search, ListChecks, Rocket } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-10 h-10 text-pink-400" />,
    title: "Step 1: Discover",
    description: "Take a short interactive quiz to explore your interests and strengths.",
  },
  {
    icon: <ListChecks className="w-10 h-10 text-pink-400" />,
    title: "Step 2: Analyze",
    description: "Our AI processes your answers and reveals tailored insights.",
  },
  {
    icon: <Rocket className="w-10 h-10 text-pink-400" />,
    title: "Step 3: Grow",
    description: "Get personalized suggestions on skills and career paths to explore.",
  },
];

export default function HowItWorks() {
  return (
    <section id="howitworks" className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-white mb-12"
        >
          How It <span className="text-pink-400">Works</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-8 bg-black/30 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-6">{step.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
