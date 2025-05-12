'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function MealSettings() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    meals: [],
  });

  useEffect(() => {
    if (session?.user?.profile) {
      setFormData({
        meals: session.user.profile.meals || [],
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      meals: checked ? [...prev.meals, name] : prev.meals.filter((meal) => meal !== name),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.meals.length === 0) {
      toast.error('Please select at least one meal.');
      return;
    }
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Meal settings updated!');
      } else {
        toast.error('Failed to update settings.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  if (!session) return <div>Please sign in</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 bg-gray-100"
    >
      <h1 className="text-3xl font-bold mb-6">Meal Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <form onSubmit={handleSubmit}>
          <p className="mb-4 text-gray-700">Select your daily meals (at least one required):</p>
          <div className="mb-4 space-y-2">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
              <label key={meal} className="flex items-center">
                <input
                  type="checkbox"
                  name={meal}
                  checked={formData.meals.includes(meal)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={formData.meals.length === 0}
            className={`w-full p-2 rounded text-white ${
              formData.meals.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Update Meal Settings
          </button>
        </form>
      </div>
    </motion.div>
  );
}