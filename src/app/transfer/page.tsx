"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowRight, LogOut, CheckCircle } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

interface PendingTransfer {
  amount: string;
  from: string;
  to: string;
  rate: number | null;
  receiveAmount: string;
}

interface Bank {
  id:   number;
  name: string;
  code: string;
}

const PAYSTACK_CURRENCIES = ["NGN", "GHS"];

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function TransferPageContent() {
  const { token, user, logout } = useAuth();
  const router                  = useRouter();

  const [quote, setQuote]                   = useState<PendingTransfer | null>(null);
  const [recipientName, setRecipientName]   = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [bankName, setBankName]             = useState("");
  const [bankCode, setBankCode]             = useState("");
  const [banks, setBanks]                   = useState<Bank[]>([]);
  const [isVerifying, setIsVerifying]       = useState(false);
  const [isVerified, setIsVerified]         = useState(false);
  const [verifyError, setVerifyError]       = useState<string | null>(null);
  const [error, setError]                   = useState<string | null>(null);
  const [isLoading, setIsLoading]           = useState(false);

  const isPaystackCountry = quote ? PAYSTACK_CURRENCIES.includes(quote.to) : false;
  const minAccountLen     = quote?.to === "NGN" ? 10 : 8;

  useEffect(() => {
    const stored = sessionStorage.getItem("pendingTransfer");
    if (stored) {
      setQuote(JSON.parse(stored) as PendingTransfer);
    } else {
      router.replace("/");
    }
  }, [router]);

  // Load bank list for NGN / GHS
  useEffect(() => {
    if (!quote || !PAYSTACK_CURRENCIES.includes(quote.to)) return;
    fetch(`/api/bank/list?currency=${quote.to}`)
      .then((r) => r.json())
      .then((data) => { if (data.status && data.data) setBanks(data.data); })
      .catch(() => {});
  }, [quote]);

  const verifyAccount = useCallback(async (accountNumber: string, code: string) => {
    setIsVerifying(true);
    setVerifyError(null);
    setIsVerified(false);
    setRecipientName("");
    try {
      const res  = await fetch(`/api/bank/resolve?account_number=${accountNumber}&bank_code=${code}`);
      const data = await res.json();
      if (data.status && data.data?.account_name) {
        setRecipientName(data.data.account_name);
        setIsVerified(true);
      } else {
        setVerifyError(data.message || "Could not verify account");
      }
    } catch {
      setVerifyError("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  }, []);

  // Debounced auto-verify when account number + bank code are ready
  useEffect(() => {
    if (!isPaystackCountry) return;
    if (recipientAccount.length < minAccountLen || !bankCode) {
      setIsVerified(false);
      setRecipientName("");
      setVerifyError(null);
      return;
    }
    const timer = setTimeout(() => verifyAccount(recipientAccount, bankCode), 500);
    return () => clearTimeout(timer);
  }, [recipientAccount, bankCode, isPaystackCountry, minAccountLen, verifyAccount]);

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = banks.find((b) => b.code === e.target.value);
    setBankCode(selected?.code ?? "");
    setBankName(selected?.name ?? "");
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!quote) return;
    setError(null);
    setIsLoading(true);

    try {
      const amountInSmallestUnit = Math.round(parseFloat(quote.amount) * 100);

      const res  = await fetch("/api/payment/create-intent", {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          amountInSmallestUnit,
          currency: quote.from,
          metadata: {
            toCurrency:      quote.to,
            toAmount:        quote.receiveAmount,
            recipientName,
            recipientAccount,
            bankName,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Backend wraps payload: { status, message, data: { clientSecret, ... } }
      const secret: unknown = (data.data ?? data).clientSecret;
      if (typeof secret !== "string" || !secret.includes("_secret_")) {
        throw new Error("Payment service returned no client secret");
      }

      sessionStorage.setItem("clientSecret", secret);
      sessionStorage.setItem("paymentQuote", JSON.stringify(quote));
      router.push("/payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set up payment.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!quote) return null;

  const canSubmit = isPaystackCountry
    ? isVerified && !isVerifying
    : !!(recipientName && bankName && recipientAccount);

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
          <span className="text-foreground font-medium">1. Transfer details</span>
          <ArrowRight className="h-3 w-3" />
          <span>2. Payment</span>
          <ArrowRight className="h-3 w-3" />
          <span>3. Done</span>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">Your transfer</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{quote.amount} {quote.from}</p>
              <p className="text-xs text-muted-foreground mt-0.5">You send</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="text-right">
              <p className="text-2xl font-bold">{quote.receiveAmount} {quote.to}</p>
              <p className="text-xs text-muted-foreground mt-0.5">They receive</p>
            </div>
          </div>
          {quote.rate && (
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              Rate: 1 {quote.from} ≈ {quote.rate.toFixed(4)} {quote.to}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold">Recipient details</h2>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md py-2 px-3">
              {error}
            </p>
          )}

          {isPaystackCountry ? (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Bank</label>
                <select
                  className={selectClass}
                  value={bankCode}
                  onChange={handleBankSelect}
                  required
                >
                  <option value="">Select a bank</option>
                  {banks.map((bank) => (
                    <option key={bank.id} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Account number</label>
                <Input
                  placeholder={quote.to === "NGN" ? "10-digit account number" : "Account number"}
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value.replace(/\D/g, ""))}
                  maxLength={quote.to === "NGN" ? 10 : 20}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Account name</label>
                <div className="relative">
                  <Input
                    value={isVerifying ? "Verifying..." : recipientName}
                    readOnly
                    placeholder="Auto-filled after verification"
                    className={isVerified ? "pr-9 border-green-500" : ""}
                  />
                  {isVerified && (
                    <CheckCircle className="absolute right-2.5 top-2.5 h-4 w-4 text-green-500" />
                  )}
                </div>
                {verifyError && (
                  <p className="text-xs text-destructive">{verifyError}</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Full name</label>
                <Input
                  placeholder="Recipient's full name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Bank name</label>
                <Input
                  placeholder="e.g. Barclays, Chase, HSBC"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Account number / IBAN</label>
                <Input
                  placeholder="Account number or IBAN"
                  value={recipientAccount}
                  onChange={(e) => setRecipientAccount(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full mt-2" disabled={isLoading || !canSubmit}>
            {isLoading ? "Setting up payment..." : "Continue to Payment"}
          </Button>
        </form>
      </main>
    </div>
  );
}

export default function TransferPage() {
  return (
    <ProtectedRoute>
      <TransferPageContent />
    </ProtectedRoute>
  );
}
