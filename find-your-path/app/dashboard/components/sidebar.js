"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-black/40 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col sticky top-0">
      <h2 className="text-xl font-bold text-white mb-8">📊 Dashboard</h2>

      <nav className="flex flex-col gap-4">
        <Link
          href="/dashboard/results"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          View Results
        </Link>

        <Link
          href="/dashboard/view-answers"
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          View Answers
        </Link>
      </nav>
    </aside>
  );
}
