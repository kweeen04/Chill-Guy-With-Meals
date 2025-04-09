import connectDB from '../../../../common/db';
import Recipe from '../../../../models/Recipe';

export async function GET(req, { params }) {
  await connectDB();
  const recipe = await Recipe.findById(params.id).lean();
  if (!recipe) return new Response('Recipe not found', { status: 404 });
  return new Response(JSON.stringify(recipe), { status: 200 });
}