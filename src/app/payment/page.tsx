"use client";

import { useState, useEffect } from "react";
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
import { ArrowRight, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "");

interface QuoteData {
  amount: string;
  from: string;
  receiveAmount: string;
  to: string;
}

function CheckoutForm({ quote }: { quote: QuoteData }) {
  const stripe   = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading]   = useState(false);
  const [isReady, setIsReady]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !isReady) return;
    setError(null);
    setIsLoading(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Paying for</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">{quote.amount} {quote.from}</p>
            <p className="text-xs text-muted-foreground">You pay</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="text-right">
            <p className="text-xl font-bold">{quote.receiveAmount} {quote.to}</p>
            <p className="text-xs text-muted-foreground">They receive</p>
          </div>
        </div>
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
        {isLoading ? "Processing..." : isReady ? `Pay ${quote.amount} ${quote.from}` : "Loading..."}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  );
}

function PaymentPageContent() {
  const { user, logout } = useAuth();
  const router           = useRouter();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [quote, setQuote]               = useState<QuoteData | null>(null);

  useEffect(() => {
    const secret      = sessionStorage.getItem("clientSecret");
    const storedQuote = sessionStorage.getItem("paymentQuote");
    if (!secret || !storedQuote || !secret.includes("_secret_")) {
      router.replace("/");
      return;
    }
    setClientSecret(secret);
    setQuote(JSON.parse(storedQuote) as QuoteData);
  }, [router]);

  const handleLogout = () => { logout(); router.push("/"); };

  if (!clientSecret || !quote) return null;

  const options = {
    clientSecret,
    appearance: { theme: "night" as const },
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

      <main className="container max-w-lg mx-auto py-10 px-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <span>1. Transfer details</span>
          <ArrowRight className="h-3 w-3" />
          <span className="text-foreground font-medium">2. Payment</span>
          <ArrowRight className="h-3 w-3" />
          <span>3. Done</span>
        </div>

        <h2 className="text-lg font-semibold mb-6">Complete your payment</h2>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm quote={quote} />
        </Elements>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentPageContent />
    </ProtectedRoute>
  );
}
