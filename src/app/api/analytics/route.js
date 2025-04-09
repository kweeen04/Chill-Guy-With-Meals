import connectDB from '../../../common/db';
import Analytics from '../../../models/Analytics';

export async function POST(req) {
  await connectDB();
  const { recipeId, action } = await req.json();

  let analytics = await Analytics.findOne({ recipeId });
  if (!analytics) {
    analytics = new Analytics({ recipeId });
  }

  if (action === 'view') analytics.views += 1;
  if (action === 'rating') analytics.ratings += 1;
  if (action === 'share') analytics.shares += 1;

  analytics.lastUpdated = new Date();
  await analytics.save();

  return new Response(JSON.stringify(analytics), { status: 200 });
}

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get('recipeId');

  const analytics = await Analytics.findOne({ recipeId }).lean();
  return new Response(JSON.stringify(analytics || { views: 0, ratings: 0, shares: 0 }), { status: 200 });
}