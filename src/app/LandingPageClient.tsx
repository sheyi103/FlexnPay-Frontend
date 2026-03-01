"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { HowItWorks } from "@/components/HowItWorks/HowItWorks";
import { Features } from "@/components/Features/Features";
import { CTA } from "@/components/CTA/CTA";
import { Footer } from "@/components/Footer/Footer";
import type { Country } from "@/types";
import { allCountries } from "@/countries";

interface LandingPageClientProps {
  initialRate: number | null;
}

const DEFAULT_FROM_CODE = "GBP";
const DEFAULT_TO_CODE   = "NGN";

export function LandingPageClient({ initialRate }: LandingPageClientProps) {
  const [fromCountry, setFromCountry] = useState<Country>(() => 
    allCountries.find((c) => c.code === DEFAULT_FROM_CODE) ||
    allCountries.find((c) => c.code === "USD") ||
    allCountries[0]
  );

  const [toCountry, setToCountry] = useState<Country>(() => 
    allCountries.find((c) => c.code === DEFAULT_TO_CODE) ||
    allCountries.find((c) => c.code === "EUR") ||
    allCountries[1] // avoid same as from
  );

  // Optional: URL sync (uncomment if desired)
  /*
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from")?.toUpperCase();
    const to   = params.get("to")?.toUpperCase();

    if (from) {
      const match = allCountries.find(c => c.code === from);
      if (match && match.code !== toCountry.code) setFromCountry(match);
    }
    if (to) {
      const match = allCountries.find(c => c.code === to);
      if (match && match.code !== fromCountry.code) setToCountry(match);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("from", fromCountry.code);
      params.set("to", toCountry.code);
      const query = params.toString();
      window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    }, 600);
    return () => clearTimeout(timer);
  }, [fromCountry.code, toCountry.code]);
  */

  return (
    <>
      <Header />
      <main>
        <Hero
          fromCountry={fromCountry}
          setFromCountry={setFromCountry}
          toCountry={toCountry}
          setToCountry={setToCountry}
          countries={allCountries}
          initialRate={initialRate}
        />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
    </>
  );
}