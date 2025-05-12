'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GridIcon, ListIcon, FilterIcon, UtensilsIcon } from 'lucide-react';
import RecipeService from '@/services/RecipeService';

export default function Recipes() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // NEW


  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await RecipeService.getAllRecipes()
      setRecipes(data);
    };
    if (session) fetchRecipes();
  }, [session]);



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex w-full"
    >
      <div className="flex-1 p-6 w-full">
        {/* Tabs, Search, View Toggle */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex space-x-4">
            <button className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 font-medium">
              <FilterIcon className="w-4 h-4" /> Filters
            </button>
            <button className="text-gray-600 hover:text-blue-600 text-sm font-medium">My Food</button>
            <button className="text-gray-600 hover:text-blue-600 text-sm font-medium">My Collections</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Foods..."
                className="pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <UtensilsIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all ${viewMode === 'grid'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <GridIcon className="w-4 h-4" /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all ${viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <ListIcon className="w-4 h-4" /> List
              </button>
            </div>
          </div>
        </div>


        {/* Recipe View */}
        <div
          className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
            : 'flex flex-col space-y-4'
            } w-full`}
        >
          {recipes.map((recipe) => (
            <Link href={`/recipes/${recipe._id}`} key={recipe._id}>
              <div
                className={`bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-transform duration-200 cursor-pointer overflow-hidden ${viewMode === 'list' ? 'flex items-center space-x-4 p-4' : ''
                  }`}
              >
                {/* Image */}
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className={`${viewMode === 'grid'
                      ? 'w-full h-40 object-cover'
                      : 'w-28 h-28 object-cover rounded-lg'
                      }`}
                  />
                ) : (
                  <div
                    className={`bg-gray-200 flex items-center justify-center text-gray-500 font-medium ${viewMode === 'grid' ? 'w-full h-40' : 'w-28 h-28 rounded-lg'
                      }`}
                  >
                    No Image
                  </div>
                )}

                {/* Details */}
                <div className={`${viewMode === 'list' ? 'flex-1 pl-2' : 'p-4'}`}>
                  <h2 className="text-lg font-semibold text-gray-800">{recipe.title}</h2>
                  <p className="text-sm text-gray-500">{recipe.calories} Calories</p>
                  <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                      {recipe.macros.carbs}g Carbs
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                      {recipe.macros.fat}g Fat
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-purple-400"></span>
                      {recipe.macros.protein}g Protein
                    </span>
                  </div>
                </div>
              </div>
            </Link>

          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-6">
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
            More
          </button>
        </div>
      </div>
    </motion.div>
  );
}
