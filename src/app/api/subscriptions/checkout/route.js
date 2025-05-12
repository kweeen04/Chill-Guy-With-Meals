import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../common/db';
import User from '../../../../models/User';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  console.log('Session User ID:', session.user.id);


  await connectDB();
  const { plan } = await req.json();
  const user = await User.findById(session.user.id);

  const priceId = plan === 'monthly' ? 'price_1RAixw2fdc8VbWW3BREmKPn9' : 'price_1RAiyK2fdc8VbWW3Mtq89g4v';

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: user.subscription.stripeCustomerId || undefined,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/subscriptions?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscriptions?canceled=true`,
  });

  if (!user.subscription.stripeCustomerId) {
    console.log('Stripe Customer ID:', checkoutSession.customer);
    await User.findByIdAndUpdate(session.user.id, {
      'subscription.stripeCustomerId': checkoutSession.customer,
    });
  }

  return new Response(JSON.stringify({ url: checkoutSession.url }), { status: 200 });
}