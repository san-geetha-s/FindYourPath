"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Loader from "../components/Loader";
// Career suggestions by category
const careerSuggestions = {
  R: [
    "Mechanical Engineer", "Civil Engineer", "Automotive Technician", "Electrician",
    "Robotics Operator", "Drone Technician", "Carpenter", "Construction Manager",
    "Agricultural Engineer", "Marine Engineer", "Pilot", "Logistics Specialist",
    "Biomedical Technician", "Architect", "Surveyor"
  ],
  I: [
    "Data Scientist", "AI Researcher", "Doctor", "Pharmacologist",
    "Research Scientist", "Environmental Analyst", "Software Developer",
    "Astronomer", "Geneticist", "Cybersecurity Analyst", "Statistician",
    "Neuroscientist", "Mathematician", "Bioinformatician", "Economist"
  ],
  A: [
    "Graphic Designer", "UI/UX Designer", "Animator", "Game Developer",
    "Musician", "Fashion Designer", "Filmmaker", "Digital Artist",
    "Content Creator", "Illustrator", "Photographer", "Interior Designer",
    "Creative Writer", "AR/VR Experience Designer", "Multimedia Specialist"
  ],
  S: [
    "Teacher", "Nurse", "Counselor", "Psychologist",
    "Social Worker", "Community Manager", "Human Resources Specialist",
    "Career Coach", "Speech Therapist", "Health Educator",
    "NGO Manager", "Rehabilitation Specialist", "Life Coach",
    "Public Relations Officer", "Customer Success Manager"
  ],
  E: [
    "Entrepreneur", "Startup Founder", "Marketing Strategist",
    "Product Manager", "Business Consultant", "Sales Executive",
    "Politician", "Financial Advisor", "Venture Capital Analyst",
    "Business Development Manager", "Real Estate Developer",
    "Operations Manager", "Event Planner", "Advertising Director",
    "E-commerce Manager"
  ],
  C: [
    "Accountant", "Auditor", "Banker", "Financial Analyst",
    "Compliance Officer", "Tax Consultant", "Data Steward",
    "Supply Chain Manager", "Insurance Underwriter", "Inventory Manager",
    "Legal Secretary", "Payroll Specialist", "Risk Analyst",
    "Records Manager", "Administrative Assistant"
  ],
};

// Category names
const categoryNames = {
  R: "Realistic",
  I: "Investigative",
  A: "Artistic",
  S: "Social",
  E: "Enterprising",
  C: "Conventional",
};

export default function CareerOptionsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [topTwo, setTopTwo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
const [name, setName] = useState("");

useEffect(() => {
  const storedName = localStorage.getItem("studentName") || "Student";
  setName(storedName);
}, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      try {
        const ref = doc(db, "users", currentUser.phoneNumber);
        const snap = await getDoc(ref);

        if (!snap.exists() || !snap.data().submitted) {
           
          router.push("/question-bank");
          return;
        }

        const data = snap.data();
        const answers = data.answers || {};

        // Compute scores per category
        const cats = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        Object.entries(answers).forEach(([key, value]) => {
          const [cat] = key.split("-");
          if (!cats.hasOwnProperty(cat)) return;
          if (value === "yes") cats[cat] += 1;
          else if (value === "neutral") cats[cat] += 0.5;
        });

        const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]);
        setTopTwo(sorted.slice(0, 2));
        setLoading(false);
      } catch (err) {
        console.error("Error loading career options:", err);
        router.push("/question-bank");
      }
    });

    return () => unsub();
  }, [router]);

 const handleConfirm = async () => {
  if (!selected) {
    alert("⚠️ Please select a career option first.");
    return;
  }

  try {
    const ref = doc(db, "users", user.phoneNumber);
    await updateDoc(ref, { chosenCareer: selected });

    // ✅ Save to localStorage so other pages can read it
    if (typeof window !== "undefined") {
      localStorage.setItem("career", selected);
    }

    alert(`✅ You selected: ${selected}`);
    router.push("/learning-path"); // redirect to learning path
  } catch (err) {
    console.error("Error saving career choice:", err);
    alert("❌ Failed to save your choice.");
  }
};


  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-black text-white">
  //       Loading career options...
  //     </div>
  //   );
  // }

  if(loading)
    return <Loader/>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-gray-900 text-white flex flex-col items-center p-8">
      <motion.div
        className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Choose Your Career Path
        </h1>
        <p className="mb-8 text-gray-300">
          Based on your test results, here are the top career categories and options for you.
        </p>

        {topTwo.map(([cat]) => {
          const careers = careerSuggestions[cat] || []; // ✅ safe fallback
          return (
            <div key={cat} className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                {categoryNames[cat]} ({cat})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {careers.length > 0 ? (
                  careers.map((career) => (
                    <motion.button
                      key={career}
                      onClick={() => setSelected(career)}
                      className={`p-4 rounded-xl border ${
                        selected === career
                          ? "bg-purple-600 text-white border-purple-400"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      } transition`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {career}
                    </motion.button>
                  ))
                ) : (
                  <p className="text-gray-400">No careers available for this category.</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Confirm Button */}
        <div className="flex justify-end mt-8">
          <motion.button
            onClick={handleConfirm}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-lg hover:opacity-90 shadow-xl"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Confirm & Continue
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
