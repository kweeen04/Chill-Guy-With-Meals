"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState("Verifying your subscription...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    const verifySubscription = async () => {
      try {
        const res = await fetch(`/api/subscriptions/verify?session_id=${sessionId}`);
        const data = await res.json();
        if (res.ok) {
          setMessage("🎉 Subscription successful! Welcome aboard.");
        } else {
          setMessage(`❌ Failed to verify subscription: ${data.error}`);
        }
      } catch (err) {
        setMessage("An error occurred during verification.");
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  return (
    <Suspense>
    <div className="p-10 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Subscription Status</h1>
      <p className="text-lg">{loading ? "Loading..." : message}</p>
    </div>
    </Suspense>

  );
}
