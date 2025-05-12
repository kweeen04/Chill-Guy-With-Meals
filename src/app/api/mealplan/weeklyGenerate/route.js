import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "../../../../common/db";
import MealPlan from "../../../../models/MealPlan";
import Recipe from "../../../../models/Recipe";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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

    const body = await req.json();
    const { startDate } = body;

    if (!startDate) {
      return new Response(
        JSON.stringify({
          error: 'Invalid Request',
          details: 'startDate is required',
          code: 'DATE_REQUIRED'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findById(session.user.id);

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

    console.log('User found:', {
      id: user._id,
      hasProfile: !!user.profile,
      profileData: user.profile
    });

    if (!user.profile) {
      return new Response(
        JSON.stringify({
          error: 'Profile Incomplete',
          details: 'Please complete your profile with dietary preferences and health information',
          code: 'PROFILE_REQUIRED'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { weight, height, age, gender, workHabits, meals } = user.profile;

    // Validate required profile fields
    const missingFields = [];
    if (!weight) missingFields.push('weight');
    if (!height) missingFields.push('height');
    if (!age) missingFields.push('age');
    if (!gender) missingFields.push('gender');
    if (!workHabits) missingFields.push('activity level');
    if (!meals || meals.length === 0) missingFields.push('meal preferences');

    if (missingFields.length > 0) {
      console.log('Missing profile fields:', missingFields);
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

    // Map meal preferences to capitalized meal types
    const mealTypes = meals.map(meal =>
      meal.charAt(0).toUpperCase() + meal.slice(1)
    );


    // Fetch recipes based on diet and allergies
    const dietQuery = user.profile.diet === 'none' ? {} : { diet: user.profile.diet };
    const allergiesQuery = user.profile.allergies?.length
      ? { 'ingredients.name': { $nin: user.profile.allergies } }
      : {};

    const recipes = await Recipe.find({
      ...dietQuery,
      ...allergiesQuery
    });

    if (recipes.length < mealTypes.length * 7) {
      return new Response(
        JSON.stringify({
          error: 'Not enough recipes for a full week.',
          code: 'INSUFFICIENT_RECIPES',
          found: recipes.length,
          required: mealTypes.length * 7
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Shuffle recipes
    const shuffledRecipes = recipes.sort(() => Math.random() - 0.5);
    const usedRecipeIds = new Set();
    const weeklyPlans = [];

    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);

      const dailyMeals = [];
      for (const type of mealTypes) {
        const recipe = shuffledRecipes.find(r => !usedRecipeIds.has(r._id.toString()));
        if (!recipe) break;
        usedRecipeIds.add(recipe._id.toString());

        dailyMeals.push({
          type,
          recipeId: recipe._id,
          name: recipe.title,
          calories: recipe.calories,
          macros: recipe.macros,
          imageUrl: recipe.imageUrl,
        });
      }

      const totalCalories = dailyMeals.reduce((sum, m) => sum + m.calories, 0);
      const totalMacros = dailyMeals.reduce((acc, m) => ({
        protein: acc.protein + (m.macros?.protein || 0),
        carbs: acc.carbs + (m.macros?.carbs || 0),
        fat: acc.fat + (m.macros?.fat || 0),
      }), { protein: 0, carbs: 0, fat: 0 });

      const mealPlan = await MealPlan.create({
        userId: session.user.id,
        date,
        meals: dailyMeals,
        totalCalories,
        totalMacros,
        targetCalories: dailyCalories
      });

      weeklyPlans.push(mealPlan);
    }

    return new Response(JSON.stringify({
      message: 'Weekly meal plan created successfully',
      plans: weeklyPlans
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Weekly plan error:', err);
    return new Response(
      JSON.stringify({
        error: 'Server Error',
        details: err.message,
        code: 'SERVER_ERROR'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}