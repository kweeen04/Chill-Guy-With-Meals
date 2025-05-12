'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function FoodExclusion() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({ allergies: [] });

  useEffect(() => {
    if (session?.user?.profile) {
      setFormData({ allergies: session.user.profile.allergies || [] });
    }
  }, [session]);

  const handleChange = (e) => {
    const allergies = e.target.value.split(',').map((item) => item.trim()).filter(Boolean);
    setFormData({ allergies });
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
        toast.success('Food exclusions updated!');
      } else {
        toast.error('Failed to update exclusions.');
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
      <h1 className="text-3xl font-bold mb-6">Food Exclusions</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Allergies (comma-separated)</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., nuts, dairy"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Update Exclusions
          </button>
        </form>
      </div>
    </motion.div>
  );
}