"use client";

import { type FC, type Dispatch, type SetStateAction } from "react";
import type { Country } from "@/types";
import { Calculator } from "@/components/Calculator/Calculator";
import { Button } from "@/components/ui/Button";

interface HeroProps {
  fromCountry: Country;
  setFromCountry: Dispatch<SetStateAction<Country>>;
  toCountry: Country;
  setToCountry: Dispatch<SetStateAction<Country>>;
  countries: Country[];
  initialRate: number | null;
}

export const Hero: FC<HeroProps> = ({
  fromCountry,
  setFromCountry,
  toCountry,
  setToCountry,
  countries,
  initialRate,
}) => {
  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="absolute inset-0 w-full h-full opacity-20" style={{ filter: "brightness(1.2) contrast(1.2) saturate(0.5)" }}>
        <img src="/world-map.svg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/30" />
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
                Send Money, Not Hassle
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl">
                FlexPay is the simplest way to send money to loved ones abroad.
                Fast, secure, and with fees you can actually understand.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" onClick={() => handleScroll("cta")}>
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="dark:bg-transparent dark:border-gray-200 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Calculator
              fromCountry={fromCountry}
              setFromCountry={setFromCountry}
              toCountry={toCountry}
              setToCountry={setToCountry}
              countries={countries}
              initialRate={initialRate}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
