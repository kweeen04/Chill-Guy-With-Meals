import { authOptions } from "../../auth/[...nextauth]/route";
import { calculateCalories } from "@/utils/calculateCalories";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const systemPrompt = `
You are ChillMeal, a friendly AI assistant on a meal planning website.
Your job is to help users plan their meals, suggest recipes, track nutrition,
and answer food-related questions in a chill, friendly, and helpful tone.
Don't be too formal—be conversational, like a friendly coach or foodie buddy.
If the user seems lost, gently guide them to start with their goals (e.g., weight loss, muscle gain, healthy eating).
`;
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            weight,
            height,
            age,
            gender,
            workHabits,
            mealTypes,
            date,
        } = body;

        const dailyCalories = calculateCalories({
            weight,
            height,
            age,
            gender,
            workHabits,
        });


        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const userInfo = {
            weight,
            height,
            age,
            gender,
            workHabits,
            targetCalories: dailyCalories,
            meals: mealTypes,
        };



        const prompt = `
${systemPrompt}

User Info:
${JSON.stringify(userInfo, null, 2)}

Meal Plan schema:
const MealPlanSchema = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: [
    {
      type: { type: String, required: true },
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      macros: {
        protein: { type: Number, required: true },
        carbs: { type: Number, required: true },
        fat: { type: Number, required: true }
      },
      imageUrl: { type: String },
    }
  ],
  totalCalories: { type: Number, required: true },
  totalMacros: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  targetCalories: { type: Number, required: true },
};

Generate a meal plan JSON match schema hit the user's targetCalories and include appropriate meals, no more extra text please!
IMPORTANT: Return only raw JSON. No markdown, no explanation, no wrapping in code blocks.

`;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        let aiMealPlan;
        try {
            // Strip triple backticks and "json" if included
            const cleanResponse = response
                .replace(/```json/, '')
                .replace(/```/, '')
                .trim();
        
            aiMealPlan = JSON.parse(cleanResponse);
        } catch (err) {
            console.error("Gemini response parse error:", response);
            return new Response(
                JSON.stringify({
                    error: "Gemini JSON Parsing Failed",
                    details: err.message,
                    rawResponse: response,
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // const validatedMealPlan = MealPlanSchema.parse(aiMealPlan);

        // const newMealPlan = await MealPlan.create({
        //   userId: session.userId,
        //   date: new Date(date),
        //   meals: validatedMealPlan.meals,
        //   totalCalories: validatedMealPlan.totalCalories,
        //   totalMacros: validatedMealPlan.totalMacros,
        //   targetCalories: validatedMealPlan.targetCalories,
        // });

        return new Response(JSON.stringify(aiMealPlan), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Meal Plan Generation Error:", error);
        return new Response(
            JSON.stringify({
                error: "Meal Plan Generation Failed",
                message: error.message,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
