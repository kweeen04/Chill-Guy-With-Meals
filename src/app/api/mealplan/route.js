import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route'
import connectDB from '../../../common/db';
import MealPlan from '../../../models/MealPlan';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  const mealPlans = await MealPlan.find({
    userId: session.user.id,
    date: { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) },
  }).lean();

  return new Response(JSON.stringify(mealPlans), { status: 200 });
}