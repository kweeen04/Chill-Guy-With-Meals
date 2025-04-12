import { GoogleGenerativeAI } from "@google/generative-ai";

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
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hey there! I'm ChillMeal 🍽️—your personal meal planning buddy. How can I help with your meals today?",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ response: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
