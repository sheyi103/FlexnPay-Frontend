"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

type Status = "verifying" | "succeeded" | "processing" | "failed";

function TransferSuccessContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [status, setStatus] = useState<Status>("verifying");

  useEffect(() => {
    const clientSecret = searchParams.get("payment_intent_client_secret");
    if (!clientSecret) {
      router.replace("/");
      return;
    }

    stripePromise.then((stripe) => {
      if (!stripe) return;
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":  setStatus("succeeded");  break;
          case "processing": setStatus("processing"); break;
          default:           setStatus("failed");
        }
      });
    });
  }, [searchParams, router]);

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
        <p className="text-gray-300">Verifying your payment…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <>
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment failed</h1>
          <p className="text-gray-300 text-sm">
            Your payment could not be completed. No charge was made.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/">Try again</Link>
          </Button>
        </div>
      </>
    );
  }

  if (status === "processing") {
    return (
      <>
        <div className="flex justify-center">
          <Clock className="h-16 w-16 text-yellow-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Payment processing</h1>
          <p className="text-gray-300 text-sm">
            Your payment is being processed. We'll notify you by email once it's confirmed.
          </p>
        </div>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 text-sm text-yellow-300 space-y-1">
          <p>○ Payment processing</p>
          <p className="text-gray-400">○ Transfer pending confirmation</p>
        </div>
        <Button asChild className="w-full">
          <Link href="/">Back to home</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-400" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Transfer initiated!</h1>
        <p className="text-gray-300 text-sm">
          Your payment was successful. Your recipient will receive the funds
          shortly. A confirmation will be sent to your email.
        </p>
      </div>
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-4 text-sm text-green-300 space-y-1">
        <p>✓ Payment received</p>
        <p>✓ Transfer processing</p>
        <p className="text-gray-400">○ Recipient payout (within seconds)</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button asChild className="w-full">
          <Link href="/">Send another transfer</Link>
        </Button>
        <Button asChild variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center text-white space-y-6">
        <div className="flex justify-center">
          <img src="/flexpay-logo.svg" alt="FlexPay" className="h-16 w-16" />
        </div>
        <Suspense fallback={<Loader2 className="h-12 w-12 text-blue-400 animate-spin mx-auto" />}>
          <TransferSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
