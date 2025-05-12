import { authOptions } from "../../auth/[...nextauth]/route";
import { calculateCalories } from "@/utils/calculateCalories";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { RecipeSchemaString } from "@/lib/schemaString";
import connectDB from "@/common/db";
import Recipe from "@/models/Recipe";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const { weight, height, age, gender, workHabits, mealTypes } = session.user.profile;

        const dailyCalories = calculateCalories({
            weight,
            height,
            age,
            gender,
            workHabits,
        });

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
User Info: ${JSON.stringify(userInfo, null, 2)}

Recipe schema: ${RecipeSchemaString}

Please ensure the field "Please ensure the field "title" is always a short, unique, and consistent name for this dish, as it will be used to check for duplicates in the database." is always a short, unique, and consistent name for this dish, as it will be used to check for duplicates in the database.
Generate a Recipe JSON match schema hit the user's targetCalories and user's preference, no more extra text please!
IMPORTANT: Return only raw JSON. No markdown, no explanation, no wrapping in code blocks.

`;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        let aiMealPlan;
        try {
            const cleanResponse = response.replace(/```json|```/g, "").trim();
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

        // 🔥 Fetch Unsplash image using recipe name
        const query = `${aiMealPlan.englishName || "food"}`;
        const unsplashImage = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
                query
            )}&page=1&per_page=5&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        );
        const imgResult = await unsplashImage.json();
        const imgUrl =
            imgResult?.results?.[0]?.urls?.regular ||
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

        // 🧠 Replace imageUrlD
        aiMealPlan.imageUrl = imgUrl;
        console.log("AI Meal Plan ~:", aiMealPlan);
        await connectDB();
        const existing = await Recipe.findOne({ title: aiMealPlan.title });
        let savedRecipe;
        if (!existing) {
            savedRecipe = await Recipe.create(aiMealPlan);
        } else {
            savedRecipe = existing;
        }
        const responseWithId = {
            ...aiMealPlan,
            _id: savedRecipe._id,
        };
        return new Response(JSON.stringify(responseWithId), {
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
