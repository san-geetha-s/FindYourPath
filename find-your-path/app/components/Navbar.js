"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-lg z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <h1 className="text-white font-bold text-2xl">FindYourPath</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#features" className="hover:text-pink-400">Features</a>
          <a href="#howitworks" className="hover:text-pink-400">How It Works</a>
          <a href="#contact" className="hover:text-pink-400">Contact</a>
          <a
            href="/login"
            className="px-5 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-lg flex flex-col items-center gap-6 py-6 text-white">
          <a href="#features" onClick={() => setIsOpen(false)}>Features</a>
          <a href="#howitworks" onClick={() => setIsOpen(false)}>How It Works</a>
          <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
          <a
            href="/login"
            className="px-5 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
