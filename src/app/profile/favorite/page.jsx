'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Favorite() {
    const { data: session, update } = useSession();

    const [favorites, setFavorites] = useState([]);



    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                const res = await fetch('/api/user/favorites/recipes');
                if (res.ok) {
                    setFavorites(await res.json());
                }
            }
        };
        fetchData();
    }, [session]);


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
    )
}
