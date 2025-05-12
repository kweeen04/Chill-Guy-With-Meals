import Stripe from 'stripe';
import connectDB from '../../../../common/db';
import User from '../../../../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  await connectDB();

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const plan = subscription.items.data[0].price.recurring.interval === 'month' ? 'monthly' : 'yearly';
    await User.findOneAndUpdate(
      { 'subscription.stripeCustomerId': customerId },
      { 
        'subscription.status': subscription.status === 'active' ? plan : 'free',
        'subscription.stripeSubscriptionId': subscription.id,
      }
    );
  }

  return new Response('Webhook received', { status: 200 });
}