import React from "react";
import { UserPlus, CreditCard, Send } from "lucide-react";

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted scroll-mt-20"
    >
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Send Money in 3 Easy Steps
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get started in minutes and send money to your loved ones with just
              a few clicks.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="grid gap-1 text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UserPlus className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold">1. Create Your Account</h3>
            <p className="text-muted-foreground">
              Sign up for a free account in minutes. All you need is an email
              address to get started securely.
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CreditCard className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold">2. Add Recipient Details</h3>
            <p className="text-muted-foreground">
              Enter the amount you want to send and your recipient's
              information. Our low fees are always shown upfront.
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Send className="h-8 w-8" />
              </div>
            </div>
            <h3 className="text-xl font-bold">3. Send Money Instantly</h3>
            <p className="text-muted-foreground">
              Confirm your transfer and the money is sent instantly, arriving in
              your recipient's account in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
