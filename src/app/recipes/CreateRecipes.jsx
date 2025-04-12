'use client';
import { useState, useEffect } from 'react';

export default function CreateRecipes() {
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
        <div>
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
    </form> */}</div>
    )
}
