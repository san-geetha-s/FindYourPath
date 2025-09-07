"use client";

import Sidebar from "./components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-indigo-900 text-white">
      {/* Sidebar fixed on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
