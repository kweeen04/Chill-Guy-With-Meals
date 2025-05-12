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
    const { date } = body;
    console.log('Request body:', { date });

    if (!date) {
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
    console.log('User meal preferences:', mealTypes);

    // Fetch recipes based on diet and allergies
    const dietQuery = user.profile.diet === 'none' ? {} : { diet: user.profile.diet };
    const allergiesQuery = user.profile.allergies?.length 
      ? { 'ingredients.name': { $nin: user.profile.allergies } }
      : {};

    console.log('Recipe query:', { dietQuery, allergiesQuery });
    
    // Fetch up to 2 recipes per meal type
    const recipesPerMeal = 2; // Maximum recipes per meal type
    const totalRecipesNeeded = mealTypes.length * recipesPerMeal;
    const recipes = await Recipe.find({
      ...dietQuery,
      ...allergiesQuery
    }).limit(totalRecipesNeeded);

    console.log('Found recipes:', recipes.length);

    if (recipes.length < mealTypes.length) {
      return new Response(
        JSON.stringify({ 
          error: 'Recipe Error', 
          details: `Only found ${recipes.length} recipes matching your dietary preferences. Need at least ${mealTypes.length} recipes (1 per meal type).`,
          code: 'INSUFFICIENT_RECIPES',
          found: recipes.length,
          required: mealTypes.length
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Distribute recipes across meal types
    const mealPlans = [];
    let recipeIndex = 0;

    for (const mealType of mealTypes) {
      const recipesForMeal = [];
      // Assign 1 to 2 recipes per meal type
      const numRecipes = Math.min(
        2, // Max 2 recipes
        Math.max(1, Math.floor((recipes.length - recipeIndex) / (mealTypes.length - mealPlans.length))) // Ensure at least 1
      );
      
      for (let i = 0; i < numRecipes && recipeIndex < recipes.length; i++) {
        const recipe = recipes[recipeIndex];
        recipesForMeal.push({
          type: mealType,
          recipeId: recipe._id,
          name: recipe.title,
          calories: recipe.calories,
          macros: recipe.macros,
          imageUrl: recipe.imageUrl,
        });
        recipeIndex++;
      }
      mealPlans.push(...recipesForMeal);
    }

    const totalCalories = mealPlans.reduce((sum, meal) => sum + meal.calories, 0);
    const totalMacros = mealPlans.reduce(
      (acc, meal) => ({
        protein: acc.protein + (meal.macros?.protein || 0),
        carbs: acc.carbs + (meal.macros?.carbs || 0),
        fat: acc.fat + (meal.macros?.fat || 0),
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );

    console.log('Creating meal plan with:', {
      userId: session.user.id,
      date,
      mealsCount: mealPlans.length,
      totalCalories,
      totalMacros,
      targetCalories: dailyCalories,
    });

    const mealPlan = await MealPlan.create({
      userId: session.user.id,
      date: new Date(date),
      meals: mealPlans,
      totalCalories,
      totalMacros,
      targetCalories: dailyCalories,
    });

    console.log('Meal plan created successfully:', mealPlan._id);

    return new Response(
      JSON.stringify(mealPlan), 
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Meal plan generation error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Server Error', 
        details: error.message || 'An unexpected error occurred while generating your meal plan',
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