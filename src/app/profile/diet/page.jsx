'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PrimaryDiet() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    diet: 'none',
    meals: [],
    allergies: [],
  });

  useEffect(() => {
    if (session?.user?.profile) {
      setFormData({
        diet: session.user.profile.diet || 'none',
        allergies: session.user.profile.allergies || [],
        meals: session.user.profile.meals || [],
      });
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        meals: checked
          ? [...prev.meals, name]
          : prev.meals.filter((meal) => meal !== name),
      }));
    } else if (name === 'allergies') {
      const allergies = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
      setFormData((prev) => ({ ...prev, allergies }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Profile updated!');
      } else {
        toast.error('Failed to update profile.');
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
      className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 flex flex-col items-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-cyan-700">Update Dietary Profile</h1>

        {/* Diet Selection */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Diet Preference</label>
          <select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          >
            <option value="none">None</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="gluten-free">Gluten-Free</option>
          </select>
        </div>

        {/* Meal Settings */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Daily Meals <span className="text-sm text-gray-500">(select at least one)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
              <label key={meal} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={meal}
                  checked={formData.meals.includes(meal)}
                  onChange={handleChange}
                  className="accent-cyan-500"
                />
                <span className="capitalize">{meal}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block mb-2 text-gray-700 font-medium">Food Allergies / Exclusions</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies.join(', ')}
            onChange={handleChange}
            placeholder="e.g., nuts, dairy"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={formData.meals.length === 0}
          className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition ${formData.meals.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
        >
          Save Changes
        </button>
      </form>
    </motion.div>
  );
}
