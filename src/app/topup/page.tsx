"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

function CheckoutForm({ amountGbp }: { amountGbp: number }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !isReady) return;
    setError(null);
    setIsLoading(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/topup/success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Adding <span className="font-semibold text-foreground">£{amountGbp.toFixed(2)}</span> to your GBP wallet
      </div>

      <PaymentElement
        onReady={() => setIsReady(true)}
        onLoadError={() =>
          setError("Payment form failed to load. Check that your Stripe publishable key matches the environment (test/live) used by the server.")
        }
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md py-2 px-3">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={!stripe || !isReady || isLoading}>
        {isLoading ? "Processing..." : isReady ? `Pay £${amountGbp.toFixed(2)}` : "Loading..."}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  );
}

function TopUpPageContent() {
  const { token, user, logout } = useAuth();
  const router                  = useRouter();

  const [amount, setAmount]           = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [confirmedAmount, setConfirmedAmount] = useState<number>(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const handleLogout = () => { logout(); router.push("/"); };

  const handleAmountSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amountGbp = parseFloat(amount);
    if (!amountGbp || amountGbp <= 0) return;

    setError(null);
    setIsLoading(true);

    try {
      const res  = await fetch("/api/wallet/topup", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amountGbp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to create payment");

      // Backend wraps payload: { status, message, data: { clientSecret, ... } }
      const secret: unknown = (data.data ?? data).clientSecret;
      if (typeof secret !== "string" || !secret.includes("_secret_")) {
        throw new Error("Payment service returned no client secret");
      }

      setConfirmedAmount(amountGbp);
      setClientSecret(secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-14 max-w-screen-lg items-center justify-between">
          <Link href="/"><img src="/flexpay-logo.svg" alt="FlexPay" className="h-14 w-14" /></Link>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:block">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-lg mx-auto py-10 px-4 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Top up wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Add GBP funds to your FlexPay wallet</p>
        </div>

        {/* Step 1 — amount entry */}
        {!clientSecret && (
          <form onSubmit={handleAmountSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md py-2 px-3">
                {error}
              </p>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium">Amount (GBP)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">£</span>
                <Input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !amount}>
              {isLoading ? "Creating payment..." : "Continue to payment"}
            </Button>
          </form>
        )}

        {/* Step 2 — Stripe checkout */}
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance: { theme: "night" as const } }}
          >
            <CheckoutForm amountGbp={confirmedAmount} />
          </Elements>
        )}
      </main>
    </div>
  );
}

export default function TopUpPage() {
  return (
    <ProtectedRoute>
      <TopUpPageContent />
    </ProtectedRoute>
  );
}
