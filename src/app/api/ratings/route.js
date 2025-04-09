import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../common/db';
import Rating from '../../../models/Rating';
import Recipe from '../../../models/Recipe';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const { recipeId, rating } = await req.json();

  await Rating.findOneAndUpdate(
    { userId: session.user.id, recipeId },
    { rating },
    { upsert: true, new: true }
  );

  const ratings = await Rating.find({ recipeId });
  const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;
  const ratingCount = ratings.length;

  await Recipe.findByIdAndUpdate(recipeId, { averageRating, ratingCount });

  return new Response(JSON.stringify({ averageRating, ratingCount }), { status: 200 });
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get('recipeId');

  const userRating = await Rating.findOne({ userId: session.user.id, recipeId })?.rating || 0;
  return new Response(JSON.stringify({ userRating }), { status: 200 });
}