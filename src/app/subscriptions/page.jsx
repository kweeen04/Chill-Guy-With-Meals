"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Debug imports
console.log("Stripe Imports:", { Elements, CardElement, useStripe, useElements });

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.reject(new Error("Stripe publishable key is not defined"));

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch("/api/subscriptions/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error("Failed to fetch plans:", err));
  }, []);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Choose Your Subscription</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedPlan?.id === plan.id ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => handlePlanSelect(plan)}
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-2xl">${plan.amount / 100}/{plan.interval}</p>
            <p>{plan.description}</p>
          </div>
        ))}
      </div>
      {selectedPlan && (
        <Elements stripe={stripePromise}>
          <CheckoutForm plan={selectedPlan} />
        </Elements>
      )}
    </div>
  );
}

function CheckoutForm({ plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Debug inside CheckoutForm
  console.log("CheckoutForm Imports:", { CardElement, useStripe, useElements });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/subscriptions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan.id, paymentMethodId: paymentMethod.id }),
    });

    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-2 border rounded" />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Processing..." : `Pay $${plan.amount / 100}/${plan.interval}`}
      </button>
    </form>
  );
}