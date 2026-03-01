"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock } from "lucide-react";

export const CTA: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      id="cta"
      className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white scroll-mt-20"
    >
      <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Be the First to Experience Smarter Money Transfers
          </h2>
          <p className="mx-auto max-w-2xl text-gray-200 md:text-xl/relaxed">
            Join our early access list and unlock{" "}
            <span className="font-bold text-white">
              free international transfers
            </span>{" "}
            for a limited time as we prepare for our official launch.
          </p>
        </div>
        <div className="w-full max-w-md mx-auto space-y-4">
          {submitted ? (
            <div className="rounded-lg border border-green-500/40 bg-green-500/10 px-6 py-5 text-center">
              <p className="text-lg font-semibold text-green-400">You&apos;re on the list!</p>
              <p className="mt-1 text-sm text-gray-300">
                We&apos;ll reach out as soon as we launch. Stay tuned.
              </p>
            </div>
          ) : (
            <>
              <form className="flex space-x-2" onSubmit={handleSubmit}>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-10 text-slate-900"
                    aria-label="Email for waitlist"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="default">
                  Join Early Access
                </Button>
              </form>
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> No spam. Secure signup.
              </p>
            </>
          )}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className="text-sm text-gray-400">Coming soon to:</span>
            <img src="/apple-logo.svg" alt="App Store" className="h-8 w-8 opacity-60" />
            <img src="/google-play-logo.svg" alt="Google Play" className="h-6 w-6" />
          </div>
        </div>
      </div>
    </section>
  );
};
