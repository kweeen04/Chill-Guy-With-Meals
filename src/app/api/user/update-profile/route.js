import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../common/db';
import User from '../../../../models/User';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const data = await req.json();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { profile: data, isFirstLogin: false },
    { new: true }
  );

  return new Response(JSON.stringify(user), { status: 200 });
}

export async function PATCH(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const data = await req.json();

  // Fetch the current user from the database to ensure we have the latest profile
  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response('User not found', { status: 404 });

  // Deep merge: Only update fields provided in the request, leave others unchanged
  const updatedProfile = {
    ...user.profile,
    ...data,
    // Preserve nested arrays like allergies if not explicitly updated
    allergies: data.allergies !== undefined ? data.allergies : user.profile.allergies,
  };

  const updatedUser = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: { 'profile': updatedProfile } },
    { new: true }
  );

  // Update session to reflect changes
  session.user.profile = updatedUser.profile;
  return new Response(JSON.stringify(updatedUser), { status: 200 });
}