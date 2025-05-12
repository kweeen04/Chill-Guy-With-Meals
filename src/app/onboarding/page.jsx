'use client';
import { useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPreferencesContext } from '../../context/UserPreferencesContext';
import toast from 'react-hot-toast';
import ProgressIndicator from './components/ProgressIndicator';
import UnauthorizedPage from '@/components/common/UnauthorizedPage';
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
    meals: [],
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

  if (!session) return <UnauthorizedPage />
  if (session?.user?.profile?.meals?.length > 0) {
    router.push('/mealplan');
  }
  return (
    <>
      <ProgressIndicator step={step} />
      <div className="bg-blue-50 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            A short survey about your current health?{' '}
            <span className="text-yellow-500">👇</span>
          </h1>
          <form onSubmit={handleSubmit} >
            {step === 1 && (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <p className="text-xl font-bold text-cyan-600 mb-4">
                  Step 1:{' '}
                  <span className="font-normal text-gray-700">Basic information</span>
                </p>

                <div className="space-y-4">
                  {/* Weight */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Your Weight"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Height (cm) */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="Your Height (cm)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/*Age */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Your Age"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-cyan-500 transition duration-300 cursor-pointer"
                  >
                    NEXT STEP »
                  </button>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Your information is safe and we don’t share it with anyone.
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <p className="text-xl font-bold text-cyan-600 mb-4">
                  Step 2:{' '}
                  <span className="font-normal text-gray-700">Lifestyle</span>
                </p>

                <div className="space-y-4">
                  {/* Work Habits */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Work Habits</label>
                    <select
                      name="workHabits"
                      value={formData.workHabits}
                      onChange={handleChange}
                      placeholder="Your Weight"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="active">Active</option>
                      <option value="very active">Very Active</option>
                    </select>
                  </div>

                  {/* Eating Habits */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Eating Habits</label>
                    <select
                      name="eatingHabits"
                      value={formData.eatingHabits}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="light">Light</option>
                      <option value="moderate">Moderate</option>
                      <option value="heavy">Heavy</option>
                      <option value="snacker">Snacker</option>
                    </select>
                  </div>



                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-cyan-500 transition duration-300 cursor-pointer"
                  >
                    NEXT STEP »
                  </button>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Your information is safe and we don’t share it with anyone.
                  </p>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <p className="text-xl font-bold text-cyan-600 mb-4">
                  Step 3:{' '}
                  <span className="font-normal text-gray-700">Preferences</span>
                </p>

                <div className="space-y-4">
                  {/* Work Habits */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Diet Preference</label>
                    <select
                      name="diet"
                      value={formData.diet}
                      onChange={handleChange}
                      placeholder="Your Diet Preference"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="none">None</option>
                      <option value="vegan">Vegan</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                      <option value="gluten-free">Gluten-Free</option>
                    </select>
                  </div>

                  {/* Allergies */}
                  <div className="flex flex-col">
                    <label className="text-left text-sm font-medium text-gray-700 mb-1">Allergies (comma-separated)</label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies.join(', ')}
                      onChange={handleAllergiesChange}
                      placeholder="Ex: nuts, dairy"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-cyan-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-cyan-500 transition duration-300 cursor-pointer"
                  >
                    NEXT STEP »
                  </button>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Your information is safe and we don’t share it with anyone.
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                <p className="text-xl font-bold text-cyan-600 mb-4">
                  Step 4:{' '}
                  <span className="font-normal text-gray-700">Meal Preferences</span>
                </p>

                <div className="space-y-4">
                  {/* Work Habits */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Select your preferred meals
                    </label>

                    {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
                      <label key={meal} className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                        <input
                          type="checkbox"
                          value={meal}
                          checked={formData.meals.includes(meal)}
                          onChange={handleMealsChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-800 capitalize">{meal}</span>
                      </label>
                    ))}

                    {/* {formData.meals.length === 0 && (
    <p className="text-red-500 text-sm mt-1">Please select at least one meal</p>
  )} */}
                  </div>

                  <button
                    type="submit"

                    className="w-full bg-cyan-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-cyan-500 transition duration-300 cursor-pointer"
                  >
                    FINISH
                  </button>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Your information is safe and we don’t share it with anyone.
                  </p>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>

    </>
  );
}