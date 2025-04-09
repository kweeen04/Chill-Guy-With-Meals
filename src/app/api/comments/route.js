import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../common/db';
import Comment from '../../../models/Comment';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const { recipeId, text } = await req.json();

  const comment = await Comment.create({
    userId: session.user.id,
    recipeId,
    text,
  });

  await comment.populate('userId', 'name');
  return new Response(JSON.stringify(comment), { status: 201 });
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get('recipeId');

  const comments = await Comment.find({ recipeId })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return new Response(JSON.stringify(comments), { status: 200 });
}