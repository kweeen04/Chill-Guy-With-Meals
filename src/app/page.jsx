"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4 md:px-6 text-center max-w-full"
    >
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-800">
          Welcome to MealGenie 🍽️
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Your personalized AI-powered meal planner. Plan smarter, eat better.
        </p>
      </header>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
        >
          Login
        </button>
        <button
          onClick={() => router.push("/auth/signup")}
          className="bg-white text-blue-600 px-6 py-3 rounded-md border border-blue-500 hover:bg-blue-50 transition-all"
        >
          Sign Up
        </button>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-gray-500 text-sm">
        <p>&copy; 2025 MealGenie. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}
