
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/** @type {import('next').NextRequest} */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return Response.json({ error: "Missing session ID" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return Response.json({ status: session.payment_status }, { status: 200 });
  } catch (err) {
    console.error("Stripe verification error:", err);
    return Response.json({ error: "Failed to verify subscription" }, { status: 400 });
  }
}
