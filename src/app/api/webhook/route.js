import Stripe from "stripe";
import { buffer } from "micro";
import connectDB from "../../../common/db";
import User from "../../../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err) {
    console.error("Stripe Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const user = await User.findOne({ "subscription.stripeSubscriptionId": session.id });
    if (user) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      user.subscription = {
        status: subscription.plan.interval === "month" ? "monthly" : "yearly",
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
      };
      await user.save();
    }
  }

  res.status(200).json({ received: true });
}