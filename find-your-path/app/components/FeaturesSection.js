"use client";
import { motion } from "framer-motion";
import { Sparkles, Brain, Compass } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-10 h-10 text-pink-400" />,
    title: "AI-Powered Insights",
    description: "Smart recommendations to uncover your strengths and passions.",
  },
  {
    icon: <Compass className="w-10 h-10 text-pink-400" />,
    title: "Personalized Path",
    description: "Custom guidance tailored to your interests and career goals.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-pink-400" />,
    title: "Simple & Engaging",
    description: "Interactive quiz experience that makes self-discovery fun.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent to-black/30">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-white mb-12"
        >
          Why Choose <span className="text-pink-400">FindYourPath</span>?
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-8 bg-black/30 border border-white/10 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
