"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Country } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CountrySelector } from "../CountrySelector/CountrySelector";
import { ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const RATE_REFRESH_MS = 5 * 60 * 1000;

interface QuoteResponse {
  status: string;
  data: { effectiveRate: number };
}

interface CalculatorProps {
  fromCountry: Country;
  setFromCountry: Dispatch<SetStateAction<Country>>;
  toCountry: Country;
  setToCountry: Dispatch<SetStateAction<Country>>;
  countries: Country[];
  initialRate: number | null;
}

export const Calculator: React.FC<CalculatorProps> = ({
  fromCountry,
  setFromCountry,
  toCountry,
  setToCountry,
  countries,
  initialRate,
}) => {
  const [amountToSend, setAmountToSend] = useState("100.00");
  const [amountToReceive, setAmountToReceive] = useState("0.00");
  const [rate, setRate] = useState<number | null>(initialRate);
  const [isFetchingRate, setIsFetchingRate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const router = useRouter();
  const { token } = useAuth();

  const fromCountries = countries.filter((c) => c.code !== toCountry.code);
  const toCountries   = countries.filter((c) => c.code !== fromCountry.code);

  /**
   * fetchRate accepts the pair directly so handlers always pass fresh values —
   * no stale closure or ref-timing issues.
   */
  const fetchRate = useCallback(async (
    from: Country,
    to: Country,
    signal?: AbortSignal,
  ) => {
    setError(null);
    setIsFetchingRate(true);
    try {
      const res = await fetch("/api/fx/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceAmount: 1,
          sourceCurrency: from.code,
          destinationCurrency: to.code,
        }),
        signal,
      });
      if (!res.ok) throw new Error("Could not retrieve the rate.");
      const data: QuoteResponse = await res.json();
      setRate(data.data.effectiveRate);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Could not retrieve the rate.");
      setRate(null);
    } finally {
      setIsFetchingRate(false);
    }
  }, []);

  // Refs for the 5-min interval so it always reads the current pair
  const fromRef = useRef(fromCountry);
  const toRef   = useRef(toCountry);
  useEffect(() => { fromRef.current = fromCountry; }, [fromCountry]);
  useEffect(() => { toRef.current   = toCountry;   }, [toCountry]);

  /**
   * Mount: fetch the rate immediately (webpack compiles all routes upfront,
   * so this does NOT trigger recompilation or HMR).
   * AbortController keeps React Strict Mode's double-invoke safe.
   * If a server-provided initialRate exists, skip the mount fetch.
   */
  useEffect(() => {
    const controller = new AbortController();

    if (!initialRate) {
      fetchRate(fromRef.current, toRef.current, controller.signal);
    }

    const interval = setInterval(
      () => fetchRate(fromRef.current, toRef.current),
      RATE_REFRESH_MS,
    );

    return () => {
      controller.abort();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Instant local calculation — no API call on every keystroke
  useEffect(() => {
    const amount = parseFloat(amountToSend);
    if (!rate || isNaN(amount) || amount <= 0) {
      setAmountToReceive("0.00");
      return;
    }
    setAmountToReceive(
      (amount * rate).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    );
  }, [amountToSend, rate]);

  // --- Handlers ---

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(v) || v === "") setAmountToSend(v);
  };

  // Call fetchRate directly with the new pair value — never stale
  const handleFromSelect = (country: Country) => {
    setFromCountry(country);
    fetchRate(country, toCountry);
  };

  const handleToSelect = (country: Country) => {
    setToCountry(country);
    fetchRate(fromCountry, country);
  };

  const handleSwap = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setFromCountry(toCountry);
      setToCountry(fromCountry);
      setAmountToSend(
        parseFloat(amountToReceive.replace(/,/g, "")) > 0
          ? amountToReceive.replace(/,/g, "")
          : "100.00",
      );
      fetchRate(toCountry, fromCountry);
      setIsAnimating(false);
    }, 150);
  };

  const handleContinueClick = () => {
    sessionStorage.setItem(
      "pendingTransfer",
      JSON.stringify({
        amount: amountToSend,
        from: fromCountry.code,
        to: toCountry.code,
        rate,
        receiveAmount: amountToReceive,
      }),
    );
    router.push(token ? "/transfer" : "/login?next=/transfer");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
        <CardDescription>
          Fast, secure, and affordable international transfers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-1">
          {/* You Send */}
          <div
            className={cn(
              "flex items-center w-full rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
              "transition-opacity duration-300",
              isAnimating && "opacity-0",
            )}
          >
            <Input
              type="text"
              inputMode="decimal"
              value={amountToSend}
              onChange={handleAmountChange}
              className="pr-2 text-lg border-0 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 w-full"
              placeholder="0.00"
            />
            <CountrySelector
              selectedCountry={fromCountry}
              onSelect={handleFromSelect}
              countries={fromCountries}
            />
          </div>

          {/* Swap */}
          <div className="py-1">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={handleSwap}
              disabled={isAnimating}
              aria-label="Swap currencies"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* They Receive */}
          <div
            className={cn(
              "flex items-center w-full rounded-md border border-input bg-secondary ring-offset-background",
              "transition-opacity duration-300",
              isAnimating && "opacity-0",
            )}
          >
            <Input
              type="text"
              value={isFetchingRate ? "..." : amountToReceive}
              readOnly
              disabled
              className="pr-2 text-lg font-semibold border-0 rounded-r-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 w-full"
              placeholder="0.00"
            />
            <CountrySelector
              selectedCountry={toCountry}
              onSelect={handleToSelect}
              countries={toCountries}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive text-center">{error}</p>
        )}
        <p className="mt-4 text-sm text-center text-muted-foreground">
          {isFetchingRate
            ? "Fetching latest rate..."
            : rate
            ? `1 ${fromCountry.code} ≈ ${rate.toFixed(2)} ${toCountry.code}`
            : "Enter an amount to see the rate"}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleContinueClick}
          disabled={isFetchingRate || !amountToSend || parseFloat(amountToSend) <= 0}
        >
          {isFetchingRate ? "Loading rate..." : "Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};
