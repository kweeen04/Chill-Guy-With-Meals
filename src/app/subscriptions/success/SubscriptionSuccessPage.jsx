'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function SubscriptionSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [message, setMessage] = useState("Verifying your subscription...");
    const [status, setStatus] = useState < "loading" | "success" | "error" > ("loading");

    useEffect(() => {
        if (!sessionId) {
            setMessage("Missing session ID.");
            setStatus("error");
            return;
        }

        const verifySubscription = async () => {
            try {
                const res = await fetch(`/api/subscriptions/verify?session_id=${sessionId}`);
                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage("🎉 Subscription successful! Welcome aboard.");
                } else {
                    setStatus("error");
                    setMessage(`❌ Failed to verify subscription: ${data.error}`);
                }
            } catch (err) {
                setStatus("error");
                setMessage("❌ An error occurred during verification.");
            }
        };

        verifySubscription();
    }, [sessionId]);

    const statusIcon = {
        loading: <Loader2 className="animate-spin text-blue-500 w-10 h-10" />,
        success: <CheckCircle className="text-green-500 w-10 h-10" />,
        error: <XCircle className="text-red-500 w-10 h-10" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center p-6 bg-gray-50"
        >
            <div className="bg-white p-8 rounded-xl shadow-md max-w-xl w-full text-center">
                <div className="flex justify-center mb-4">
                    {statusIcon[status]}
                </div>
                <h1 className="text-2xl font-semibold mb-2">Subscription Status</h1>
                <p className="text-gray-700 mb-6">{message}</p>

                {status === "success" && (
                    <Link href="/dashboard">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                            Go to Dashboard
                        </button>
                    </Link>
                )}

                {status === "error" && (
                    <Link href="/subscribe">
                        <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition">
                            Try Again
                        </button>
                    </Link>
                )}
            </div>
        </motion.div>
    );
}
