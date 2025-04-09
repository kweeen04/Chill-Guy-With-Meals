'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function PrimaryDiet() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ diet: 'none' });

  useEffect(() => {
    if (session?.user?.profile) {
      setFormData({ diet: session.user.profile.diet || 'none' });
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ diet: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PATCH', // Using PATCH for partial updates
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Diet updated!');
      } else {
        toast.error('Failed to update diet.');
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
      <h1 className="text-3xl font-bold mb-6">Primary Diet</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Diet Preference</label>
            <select
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="none">None</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="gluten-free">Gluten-Free</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Update Diet
          </button>
        </form>
      </div>
    </motion.div>
  );
}