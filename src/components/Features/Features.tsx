import React from "react";
import { Globe, ShieldCheck, Zap } from "lucide-react";

export const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="w-full py-12 md:py-24 lg:py-32 scroll-mt-20"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              Key Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Why Choose FlexPay?
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We're dedicated to providing the best international money transfer
              experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-12">
          <div className="grid gap-1">
            <div className="flex items-center gap-4">
              <Zap className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-bold">Lightning-Fast Transfers</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Send money across the globe in minutes. Our modern technology
              ensures your funds arrive almost instantly.
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center gap-4">
              <Globe className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-bold">Transparent Low Fees</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Keep more of your hard-earned money. We're committed to fair
              pricing with no hidden charges, ever.
            </p>
          </div>
          <div className="grid gap-1">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-bold">Bank-Level Security</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your security is our priority. We use industry-leading encryption
              to protect your data and transactions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
