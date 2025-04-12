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
import MealList from './MealList';
import { PageIntro } from '@/components/PageIntro';
import { FlameIcon, BarChartIcon, TargetIcon } from 'lucide-react';
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
        <PageIntro eyebrow="Premium featured" title="AI Meal Planner">
          <p>
            Our AI Meal Planner is designed to help you achieve your fitness
            goals by providing personalized meal plans tailored to your dietary
            needs and preferences.
          </p>
        </PageIntro>


        <button
          onClick={generateMealPlan}
          disabled={loading}
          className="mt-12 bg-cyan-600 text-white py-2 px-4 rounded hover:bg-cyan-700 transition disabled:opacity-50 flex cursor-pointer"
        >
          <WandSparkles className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'Generate Meal Plan'}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        {mealPlan && <MealList mealPlan={mealPlan} />}
        {mealPlan && (
          <div className="mt-8 space-y-6">


            {/* Horizontal Bar Chart */}
            <div className="bg-gray-50 rounded p-4 shadow">
              <h3 className="font-semibold mb-2">Macro Breakdown</h3>
              <div className="h-48">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            {/* Total Stats */}
            <div className="p-6 bg-white rounded-2xl shadow-md dark:bg-gray-900 space-y-4">
              <div className="flex items-center gap-3">
                <FlameIcon className="text-red-500 w-5 h-5" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Calories</p>
                <p className="ml-auto text-base font-semibold text-gray-900 dark:text-white">{mealPlan.totalCalories}</p>
              </div>
              <div className="flex items-center gap-3">
                <BarChartIcon className="text-blue-500 w-5 h-5" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Macros</p>
                <p className="ml-auto text-base font-semibold text-gray-900 dark:text-white">
                  {mealPlan.totalMacros.protein}g P / {mealPlan.totalMacros.carbs}g C / {mealPlan.totalMacros.fat}g F
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TargetIcon className="text-green-500 w-5 h-5" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Target Calories</p>
                <p className="ml-auto text-base font-semibold text-gray-900 dark:text-white">{mealPlan.targetCalories}</p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
