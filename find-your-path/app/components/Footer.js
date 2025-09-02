"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/40 border-t border-white/10 py-10 px-6 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        
        {/* Branding */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white font-bold text-xl"
        >
          FindYourPath
        </motion.h3>

        {/* Links */}
        <div className="flex gap-6 text-gray-300 text-sm">
          <a href="#features" className="hover:text-pink-400">Features</a>
          <a href="#howitworks" className="hover:text-pink-400">How It Works</a>
          <a href="#contact" className="hover:text-pink-400">Contact</a>
        </div>

        {/* Socials */}
        <div className="flex gap-5">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <Github className="w-6 h-6 text-gray-300 hover:text-pink-400 transition-colors" />
          </a>
          <a href="https://linkedin.com/in/yourlinkedin" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 text-gray-300 hover:text-pink-400 transition-colors" />
          </a>
          <a href="mailto:your@email.com">
            <Mail className="w-6 h-6 text-gray-300 hover:text-pink-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* Bottom Note */}
      <p className="text-center text-gray-400 text-xs mt-6">
        © {new Date().getFullYear()} FindYourPath. Built with ❤️ by Sankita.
      </p>
    </footer>
  );
}
