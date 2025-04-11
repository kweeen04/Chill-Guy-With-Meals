'use client';

import { useState } from 'react';
import { WandSparkles } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MealPlannerPage() {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateMealPlan = async () => {
    setLoading(true);
    setError('');
    setMealPlan(null);

    try {
      const response = await fetch('/api/mealplan/aiSuggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: 70,
          height: 175,
          age: 28,
          gender: 'male',
          workHabits: 'moderately_active',
          mealTypes: ['breakfast', 'lunch', 'dinner'],
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch meal plan');

      const data = await response.json();
      setMealPlan(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Prepare macro % chart
  let macroPercentages = { fat: 0, carbs: 0, protein: 0 };
  if (mealPlan?.totalMacros) {
    const total =
      mealPlan.totalMacros.fat +
      mealPlan.totalMacros.carbs +
      mealPlan.totalMacros.protein;

    if (total > 0) {
      macroPercentages = {
        fat: Math.round((mealPlan.totalMacros.fat / total) * 100),
        carbs: Math.round((mealPlan.totalMacros.carbs / total) * 100),
        protein: Math.round((mealPlan.totalMacros.protein / total) * 100),
      };
    }
  }

  const barData = {
    labels: ['Fat', 'Carbs', 'Protein'],
    datasets: [
      {
        label: 'Macro Distribution (%)',
        data: [
          macroPercentages.fat,
          macroPercentages.carbs,
          macroPercentages.protein,
        ],
        backgroundColor: ['#4FD1C5', '#F6E05E', '#B794F4'],
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
    scales: {
      x: {
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6">AI Meal Planner</h1>

        <button
          onClick={generateMealPlan}
          disabled={loading}
          className="bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition disabled:opacity-50 flex"
        >
          <WandSparkles className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {mealPlan && (
          <div className="mt-8 space-y-6">
            {mealPlan.meals?.map((meal, idx) => (
              <div key={idx} className="p-4 border rounded shadow-sm">
                <h3 className="text-lg font-bold capitalize">{meal.type}</h3>
                <p className="text-gray-700">{meal.name}</p>
                <p className="text-sm text-gray-500">
                  Calories: {meal.calories}
                </p>
                <p className="text-sm text-gray-500">
                  Macros: {meal.macros.protein}g P / {meal.macros.carbs}g C /{' '}
                  {meal.macros.fat}g F
                </p>
                {meal.imageUrl && (
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="mt-2 w-full max-w-sm rounded"
                  />
                )}
              </div>
            ))}

            {/* Horizontal Bar Chart */}
            <div className="bg-gray-50 rounded p-4 shadow">
              <h3 className="font-semibold mb-2">Macro Breakdown</h3>
              <div className="h-48">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            {/* Total Stats */}
            <div className="p-4 bg-gray-100 rounded">
              <p>
                <strong>Total Calories:</strong> {mealPlan.totalCalories}
              </p>
              <p>
                <strong>Total Macros:</strong>{' '}
                {mealPlan.totalMacros.protein}g P /{' '}
                {mealPlan.totalMacros.carbs}g C /{' '}
                {mealPlan.totalMacros.fat}g F
              </p>
              <p>
                <strong>Target Calories:</strong> {mealPlan.targetCalories}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
