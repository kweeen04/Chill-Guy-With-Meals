'use client';

import { useState } from 'react';
import { WandSparkles } from 'lucide-react';

import MealList from './MealList';
import { PageIntro } from '@/components/PageIntro';
import { FlameIcon, BarChartIcon, TargetIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MealPlannerPage() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const generateMealPlan = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/mealplan/aiSuggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to fetch meal plan');

      const data = await response.json();

      router.push(`/recipes/${data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-10">
        <PageIntro eyebrow="Premium featured" title="AI Recipe Planner">
          <p className="text-gray-700 text-lg leading-relaxed max-w-prose mx-auto">
            Our AI Recipe Planner is designed to help you achieve your fitness
            goals by providing personalized meal plans tailored to your dietary
            needs and preferences.
          </p>
        </PageIntro>

        <div className="flex justify-center mt-12">
          <button
            onClick={generateMealPlan}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:from-cyan-600 hover:to-blue-600 transition focus:outline-none focus:ring-4 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <WandSparkles className="h-5 w-5" />
            {loading ? 'Generating...' : 'Generate Recipe'}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-center mt-6 font-medium">{error}</p>
        )}


      </div>
    </div>
  );
}

