import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "../../../../common/db";
import MealPlan from "../../../../models/MealPlan";
import Recipe from "../../../../models/Recipe";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    console.log('Starting meal plan food regeneration...');

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Unauthorized: No session found.');
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized', 
          details: 'Please sign in to continue',
          code: 'AUTH_REQUIRED'
        }), 
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!session.user?.id) {
      console.log('Invalid session - missing user ID:', session);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Session', 
          details: 'User ID not found in session',
          code: 'INVALID_SESSION'
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await connectDB();
    console.log('Database connected');

    const { date } = await req.json();
    if (!date) {
      console.log('Missing date in request body');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Request', 
          details: 'Date is required',
          code: 'DATE_REQUIRED'
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Finding user with ID:', session.user.id);
    const user = await User.findById(session.user.id).exec();
    if (!user) {
      console.log('User not found with ID:', session.user.id);
      return new Response(
        JSON.stringify({ 
          error: 'User Not Found', 
          details: 'Unable to find user profile',
          code: 'USER_NOT_FOUND'
        }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!user.profile) {
      console.log('Profile incomplete for user:', session.user.id);
      return new Response(
        JSON.stringify({ 
          error: 'Profile Incomplete', 
          details: 'Please complete your profile with dietary preferences and health information',
          code: 'PROFILE_REQUIRED'
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { weight, height, age, gender, workHabits } = user.profile;

    const missingFields = [];
    if (!weight) missingFields.push('weight');
    if (!height) missingFields.push('height');
    if (!age) missingFields.push('age');
    if (!gender) missingFields.push('gender');
    if (!workHabits) missingFields.push('activity level');

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Profile Incomplete', 
          details: `Missing required profile information: ${missingFields.join(', ')}`,
          code: 'MISSING_PROFILE_FIELDS',
          fields: missingFields
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate BMR and daily calories
    const bmr = gender.toLowerCase() === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very active': 1.9
    };

    const normalizedWorkHabits = workHabits.toLowerCase();
    if (!activityMultipliers[normalizedWorkHabits]) {
      console.log('Invalid activity level:', workHabits);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid Activity Level', 
          details: `Activity level "${workHabits}" is not valid. Please select from: ${Object.keys(activityMultipliers).join(', ')}`,
          code: 'INVALID_ACTIVITY_LEVEL',
          validLevels: Object.keys(activityMultipliers)
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const dailyCalories = Math.round(bmr * activityMultipliers[normalizedWorkHabits]);
    console.log('Calculated daily calories:', dailyCalories);

    // Fetch new recipes
    const dietQuery = user.profile.diet === 'none' ? {} : { diet: user.profile.diet };
    const allergiesQuery = user.profile.allergies?.length 
      ? { 'ingredients.name': { $nin: user.profile.allergies } }
      : {};

    console.log('Recipe query:', { dietQuery, allergiesQuery });

    const recipes = await Recipe.find({
      ...dietQuery,
      ...allergiesQuery
    }).limit(3);

    if (recipes.length < 3) {
      return new Response(
        JSON.stringify({ 
          error: 'Recipe Error', 
          details: `Only found ${recipes.length} recipes matching your dietary preferences. Need at least 3 recipes.`,
          code: 'INSUFFICIENT_RECIPES',
          found: recipes.length,
          required: 3
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const meals = recipes.map((recipe, index) => ({
      type: ['Breakfast', 'Lunch', 'Dinner'][index],
      recipeId: recipe._id,
      name: recipe.title,
      calories: recipe.calories,
      macros: recipe.macros,
    }));

    console.log('Meals generated:', meals);

    const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalMacros = meals.reduce(
      (acc, meal) => ({
        protein: acc.protein + (meal.macros?.protein || 0),
        carbs: acc.carbs + (meal.macros?.carbs || 0),
        fat: acc.fat + (meal.macros?.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    // Find existing meal plan
    const mealPlan = await MealPlan.findOne({ userId: session.user.id, date: new Date(date) }).exec();

    if (!mealPlan) {
      return new Response(
        JSON.stringify({ 
          error: 'Meal Plan Not Found', 
          details: 'No meal plan exists for the specified date.',
          code: 'MEAL_PLAN_NOT_FOUND'
        }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update existing meal plan with new meals
    mealPlan.meals = meals;
    mealPlan.totalCalories = totalCalories;
    mealPlan.totalMacros = totalMacros;

    await mealPlan.save();
    console.log('Meal plan food regenerated successfully:', mealPlan._id);

    return new Response(
      JSON.stringify(mealPlan),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Meal plan food regeneration error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    return new Response(
      JSON.stringify({ 
        error: 'Server Error', 
        details: error.message || 'An unexpected error occurred while regenerating the meal plan food',
        code: 'SERVER_ERROR',
        name: error.name
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
