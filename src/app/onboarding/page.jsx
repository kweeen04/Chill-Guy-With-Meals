'use client';
import { useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPreferencesContext } from '../../context/UserPreferencesContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import ProgressIndicator from './components/ProgressIndicator';
export default function Onboarding() {
  const { data: session, update } = useSession();
  const { setPreferences } = useContext(UserPreferencesContext);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    gender: '',
    age: '',
    workHabits: '',
    eatingHabits: '',
    diet: 'none',
    allergies: [],
    meals: [], // Added meals array
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergiesChange = (e) => {
    const allergies = e.target.value.split(',').map((item) => item.trim());
    setFormData((prev) => ({ ...prev, allergies }));
  };

  const handleMealsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      if (checked) {
        return { ...prev, meals: [...prev.meals, value] };
      } else {
        return { ...prev, meals: prev.meals.filter((meal) => meal !== value) };
      }
    });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setPreferences(formData);
        await update({ isFirstLogin: false });
        toast.success('Preferences saved!');
        router.push('/mealplan');
      } else {
        toast.error('Failed to save preferences.');
      }
    } catch (error) {
      toast.error('Something went wrong.');
    }
  };

  if (!session) return <div>Please sign in</div>;

  return (
    <>  <ProgressIndicator step={step} />
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gray-100"
    >
    
     
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Basic Info</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Next
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Lifestyle</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Work Habits</label>
              <select
                name="workHabits"
                value={formData.workHabits}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very active">Very Active</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Eating Habits</label>
              <select
                name="eatingHabits"
                value={formData.eatingHabits}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
                <option value="snacker">Snacker</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 3: Preferences</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Diet Preference</label>
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
            <div className="mb-4">
              <label className="block text-gray-700">Allergies (comma-separated)</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies.join(', ')}
                onChange={handleAllergiesChange}
                className="w-full p-2 border rounded"
                placeholder="e.g., nuts, dairy"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Step 4: Meal Preferences</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select your preferred meals</label>
              <div className="space-y-2">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
                  <label key={meal} className="flex items-center">
                    <input
                      type="checkbox"
                      value={meal}
                      checked={formData.meals.includes(meal)}
                      onChange={handleMealsChange}
                      className="mr-2"
                    />
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </label>
                ))}
              </div>
              {formData.meals.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select at least one meal</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={formData.meals.length === 0}
                className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                  formData.meals.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Finish
              </button>
            </div>
          </>
        )}
      </form>
    </motion.div></>
  );
}