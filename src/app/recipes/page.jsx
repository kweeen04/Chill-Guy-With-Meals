'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Recipes() {
  const { data: session } = useSession();
  const [recipes, setRecipes] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // NEW
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    diet: 'none',
    image: '',
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await fetch('/api/recipes');
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    };
    if (session) fetchRecipes();
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ingredients = formData.ingredients.split(',').map((item) => ({
        name: item.trim(),
        amount: '1 serving',
      }));
      const instructions = formData.instructions.split(',').map((item) => item.trim());
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ingredients,
          instructions,
          calories: Number(formData.calories),
          macros: {
            protein: Number(formData.protein),
            carbs: Number(formData.carbs),
            fat: Number(formData.fat),
          },
        }),
      });
      if (res.ok) {
        const newRecipe = await res.json();
        setRecipes((prev) => [...prev, newRecipe]);
        toast.success('Recipe added!');
        setFormData({
          title: '',
          description: '',
          ingredients: '',
          instructions: '',
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          diet: 'none',
          image: '',
        });
      } else {
        toast.error('Failed to add recipe.');
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
      className="min-h-screen flex w-full"
    >
      <div className="flex-1 p-6 w-full">
        {/* Tabs, Search, View Toggle */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex space-x-4">
            <button className="text-blue-500 font-semibold">Filters</button>
            <button className="text-gray-600">My Food</button>
            <button className="text-gray-600">My Collections</button>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search Foods..."
              className="p-2 border rounded w-64"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Add Recipe Form */}
        {/* <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['title', 'Title', 'text'],
              ['description', 'Description', 'text'],
              ['ingredients', 'Ingredients (comma-separated)', 'text'],
              ['instructions', 'Instructions (comma-separated)', 'text'],
              ['calories', 'Calories', 'number'],
              ['protein', 'Protein (g)', 'number'],
              ['carbs', 'Carbs (g)', 'number'],
              ['fat', 'Fat (g)', 'number'],
            ].map(([name, label, type]) => (
              <div key={name}>
                <label className="block text-gray-700">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required={name !== 'description'}
                />
              </div>
            ))}
            <div>
              <label className="block text-gray-700">Diet</label>
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
            <div>
              <label className="block text-gray-700">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter image URL"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600"
          >
            Add Recipe
          </button>
        </form> */}

        {/* Recipe View */}
        <div
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
              : 'flex flex-col space-y-4'
          } w-full`}
        >
          {recipes.map((recipe) => (
            <Link href={`/recipes/${recipe._id}`} key={recipe._id}>
              <div
                className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition ${
                  viewMode === 'list' ? 'flex items-center space-x-4 p-4' : ''
                }`}
              >
                {/* Image */}
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className={`${
                      viewMode === 'grid'
                        ? 'w-full h-40 object-cover rounded-t-lg'
                        : 'w-32 h-32 object-cover rounded'
                    }`}
                  />
                ) : (
                  <div
                    className={`bg-gray-200 flex items-center justify-center text-gray-500 ${
                      viewMode === 'grid'
                        ? 'w-full h-40 rounded-t-lg'
                        : 'w-32 h-32 rounded'
                    }`}
                  >
                    No Image
                  </div>
                )}
                {/* Details */}
                <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                  <h2 className="text-lg font-semibold text-blue-600">{recipe.title}</h2>
                  <p className="text-gray-600">{recipe.calories} Calories</p>
                  <div className="flex space-x-2 mt-2">
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-yellow-400 mr-1"></span>
                      <span>{recipe.macros.carbs}g Carbs</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-blue-400 mr-1"></span>
                      <span>{recipe.macros.fat}g Fat</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-4 h-4 rounded-full bg-purple-400 mr-1"></span>
                      <span>{recipe.macros.protein}g Protein</span>
                    </div>
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
