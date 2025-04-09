'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tab } from '@headlessui/react';
import { UserIcon, HeartIcon, CameraIcon, ScaleIcon, ArrowsUpDownIcon, CalendarIcon } from '@heroicons/react/24/outline';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  }
};

export default function Profile() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    gender: '',
    age: '',
  });
  const [favorites, setFavorites] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        setFormData({
          weight: session.user.profile.weight || '',
          height: session.user.profile.height || '',
          gender: session.user.profile.gender || '',
          age: session.user.profile.age || '',
        });
        setPreviewUrl(session.user.profile.profileImageUrl || '');
        const res = await fetch('/api/user/favorites/recipes');
        if (res.ok) {
          setFavorites(await res.json());
        }
      }
    };
    fetchData();
  }, [session]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profileImageUrl = session?.user?.profile?.profileImageUrl || '';
    
    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append('file', imageFile);
      formDataImage.append('upload_preset', 'profile_images');

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataImage,
        }
      );
      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        profileImageUrl = uploadData.secure_url;
      } else {
        toast.error('Image upload failed');
        return;
      }
    }

    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, profileImageUrl }),
      });
      if (res.ok) {
        toast.success('Profile updated successfully');
        await update({
          ...session,
          user: {
            ...session.user,
            profile: { ...session.user.profile, ...formData, profileImageUrl },
          },
        });
        setImageFile(null);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <UserIcon className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium">Please sign in to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900"
    >
      <div className="max-w-4xl mx-auto">
        <Tab.Group>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-700 p-1">
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      ${selected 
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
                      }
                    `}
                  >
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                      ${selected 
                        ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/[0.12] hover:text-gray-900'
                      }
                    `}
                  >
                    <HeartIcon className="w-4 h-4" />
                    Favorites
                  </button>
                )}
              </Tab>
            </Tab.List>
          </div>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-32 h-32">
                        <img
                          src={previewUrl || 'https://via.placeholder.com/150?text=No+Image'}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="profile-image"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('profile-image').click()}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <CameraIcon className="w-4 h-4" />
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="weight" className="flex items-center gap-2 text-sm font-medium">
                          <ScaleIcon className="w-4 h-4" />
                          Weight (kg)
                        </label>
                        <input
                          id="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) => handleChange('weight', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="height" className="flex items-center gap-2 text-sm font-medium">
                          <ArrowsUpDownIcon className="w-4 h-4" />
                          Height (cm)
                        </label>
                        <input
                          id="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => handleChange('height', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                          <UserIcon className="w-4 h-4" />
                          Gender
                        </label>
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => handleChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                          <CalendarIcon className="w-4 h-4" />
                          Age
                        </label>
                        <input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleChange('age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Favorite Recipes</h2>
                  <div className="h-[400px] overflow-y-auto pr-4">
                    {favorites.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <HeartIcon className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">No favorites yet</p>
                        <p className="text-sm text-gray-500">Start exploring recipes to add some favorites!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {favorites.map((recipe) => (
                          <motion.div
                            key={recipe._id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <Link href={`/recipes/${recipe._id}`}>
                              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-semibold">{recipe.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.calories} kcal</p>
                                  </div>
                                  <HeartIcon className="w-5 h-5 text-red-500" />
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </motion.div>
  );
}