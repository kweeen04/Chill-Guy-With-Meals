import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import connectDB from '../../../../../common/db';
import User from '../../../../../models/User';
import Recipe from '../../../../../models/Recipe';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).lean();
  const favoriteRecipes = await Recipe.find({ _id: { $in: user.favorites } }).lean();

  return new Response(JSON.stringify(favoriteRecipes), { status: 200 });
}