import { Suspense } from "react";
import SubscriptionSuccessPage from "./SubscriptionSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-lg">Loading subscription details...</div>}>
      <SubscriptionSuccessPage />
    </Suspense>
  );
}
