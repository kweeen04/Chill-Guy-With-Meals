import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../common/db';
import User from '../../../../models/User';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return new Response('User not found', { status: 404 });

  const { priceId } = await req.json();

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: user.subscription.stripeCustomerId || undefined,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscriptions`,
  });

  user.subscription = {
    status: priceId.includes('monthly') ? 'monthly' : 'yearly',
    stripeCustomerId: user.subscription.stripeCustomerId || checkoutSession.customer,
    stripeSubscriptionId: checkoutSession.id,
  };
  await user.save();

  return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 });
}