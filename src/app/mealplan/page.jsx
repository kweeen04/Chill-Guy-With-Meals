'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Utensils } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MealPlan() {
  const { data: session } = useSession();
  const [mealPlans, setMealPlans] = useState([]);
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const fetchMealPlans = async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/mealplan?date=${format(date, 'yyyy-MM-dd')}`);
        if (res.ok) {
          const data = await res.json();
          setMealPlans(data);
        }
      } catch (error) {
        toast.error('Failed to load meal plans');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMealPlans();
  }, [session, date]);

  const generateMealPlan = async () => {
    setIsGenerating(true);
    const loadingToast = toast.loading('Generating meal plan...');
    try {
      const res = await fetch('/api/mealplan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: format(date, 'yyyy-MM-dd') }),
      });
      if (res.ok) {
        const newPlan = await res.json();
        setMealPlans((prev) => [...prev, newPlan]);
        toast.success('Meal plan generated successfully!', {
          id: loadingToast,
        });
      } else {
        throw new Error('Failed to generate meal plan');
      }
    } catch (error) {
      toast.error('Failed to generate meal plan', {
        id: loadingToast,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateMealPlan = async () => {
    setIsRegenerating(true);
    const loadingToast = toast.loading('Regenerating meal plan...');
    try {
      const res = await fetch('/api/mealplan/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: format(date, 'yyyy-MM-dd') }),
      });
      if (res.ok) {
        const updatedPlan = await res.json();
        setMealPlans((prev) =>
          prev.map((plan) =>
            plan.date === updatedPlan.date ? updatedPlan : plan
          )
        );
        toast.success('Meal plan regenerated successfully!', {
          id: loadingToast,
        });
      } else {
        throw new Error('Failed to regenerate meal plan');
      }
    } catch (error) {
      toast.error('Failed to regenerate meal plan', {
        id: loadingToast,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const currentPlan = mealPlans.find(
    (plan) => format(new Date(plan.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  let macroPercentages = { fat: 0, carbs: 0, protein: 0 };
  if (currentPlan && currentPlan.totalMacros) {
    const totalMacros =
      currentPlan.totalMacros.fat +
      currentPlan.totalMacros.carbs +
      currentPlan.totalMacros.protein;
    if (totalMacros > 0) {
      macroPercentages.fat = Math.round((currentPlan.totalMacros.fat / totalMacros) * 100);
      macroPercentages.carbs = Math.round((currentPlan.totalMacros.carbs / totalMacros) * 100);
      macroPercentages.protein = Math.round((currentPlan.totalMacros.protein / totalMacros) * 100);
    }
  }

  const pieData = {
    labels: ['Fat', 'Carbs', 'Protein'],
    datasets: [
      {
        data: [
          macroPercentages.fat,
          macroPercentages.carbs,
          macroPercentages.protein,
        ],
        backgroundColor: ['#4FD1C5', '#F6E05E', '#B794F4'],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#4B5563',
          padding: 10,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: '#1F2937',
        titleFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (!session) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white rounded-lg shadow-md">
        <div className="p-6 text-center">
          <Utensils className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            No Access
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please sign in to view your meal plans.
          </p>
        </div>
      </div>
    );
  }

  const renderMealSection = (type) => {
    const mealsOfType = currentPlan.meals.filter((meal) => meal.type === type);
    if (mealsOfType.length === 0) return null; // Hide section if no meals of this type
    return (
      <div className='mx-16'>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800">{type}</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {mealsOfType.reduce((total, meal) => total + meal.calories, 0)}{' '}
            Calories
          </span>
        </div>
        {mealsOfType.map((meal, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
          >
            <div className="flex items-center gap-3">
              {meal.imageUrl && (
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                />
              )}
              <Link
                href={`/recipes/${meal.recipeId}`}
                className="text-gray-800 hover:text-blue-600"
              >
                {meal.name}
              </Link>
            </div>
            <span className="text-sm text-gray-600">1 serving</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen"
    >
      <div className="flex items-center justify-between mb-6 mt-16 px-12">
        <h1 className="text-2xl font-bold text-gray-800">Meals</h1>
        <div className="flex items-center gap-3">

          <div className='mr-9 flex'>
            <button
              onClick={() => setDate(new Date(date.setDate(date.getDate() - 1)))}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              &lt;
            </button>
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <span>{format(date, 'EEEE, MMM d')}</span>
              </button>
              {showCalendar && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50">
                  <input
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      setDate(new Date(e.target.value));
                      setShowCalendar(false);
                    }}
                    className="p-2 border rounded"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setDate(new Date(date.setDate(date.getDate() + 1)))}
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              &gt;
            </button>
          </div>
          {!currentPlan ? (
            <button
              onClick={generateMealPlan}
              disabled={isGenerating}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Utensils className="h-4 w-4" />
              {isGenerating ? 'Generating...' : 'Generate Meal Plan'}
            </button>
          ) : (
            <button
              onClick={regenerateMealPlan}
              disabled={isRegenerating}
              className="cursor-pointer px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Utensils className="h-4 w-4" />
              {isRegenerating ? 'Regenerating...' : 'Regenerate Meal Plan'}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-[200px] mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-[160px]"></div>
                <div className="h-4 bg-gray-200 rounded w-[140px]"></div>
                <div className="space-y-1 mt-4">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6">
          <div className="flex-1 space-y-6">
            {mealPlans.length === 0 || !currentPlan ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Utensils className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">
                    No meal plans
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No meal plans found for this date. Generate one to get
                    started!
                  </p>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-6">
                  {[currentPlan].map((plan, planIndex) => (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: planIndex * 0.1 }}
                    >
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="space-y-6">
                          {renderMealSection('Breakfast')}
                          {renderMealSection('Lunch')}
                          {renderMealSection('Dinner')}
                          {renderMealSection('Snack')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Nutrition Sidebar */}
          {currentPlan && (
            <div className="w-80 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Nutrition
              </h2>
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calories</span>
                  <span className="font-medium">
                    {currentPlan.totalCalories} /{' '}
                    <span className="text-gray-500">{currentPlan.targetCalories}</span>
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Carbs</span>
                  <span className="font-medium">
                    {currentPlan.totalMacros.carbs}g
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fat</span>
                  <span className="font-medium">
                    {currentPlan.totalMacros.fat}g
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Protein</span>
                  <span className="font-medium">
                    {currentPlan.totalMacros.protein}g
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                Detailed Nutrition Information
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}