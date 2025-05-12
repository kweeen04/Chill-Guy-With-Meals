import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../common/db';
import User from '../../../../models/User';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const { recipeId } = await req.json();
  const user = await User.findById(session.user.id);

  const isFavorited = user.favorites.includes(recipeId);
  if (isFavorited) {
    user.favorites = user.favorites.filter((id) => id.toString() !== recipeId);
  } else {
    user.favorites.push(recipeId);
  }
  await user.save();

  // Update session
  session.user.favorites = user.favorites;
  return new Response(JSON.stringify(user.favorites), { status: 200 });
}