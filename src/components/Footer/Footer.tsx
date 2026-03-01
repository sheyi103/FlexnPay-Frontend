import React from "react";
import { Twitter, Facebook, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t">
      <div className="container grid items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-start gap-4">
          <a href="/" className="flex items-center space-x-2">
            <img src="/flexpay-logo.svg" alt="FlexPay" className="h-12 w-24" />
          </a>
          <p className="text-sm text-muted-foreground">
            The smarter, faster, and cheaper way to send money internationally.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="grid gap-2 text-sm">
          <h3 className="font-semibold">Company</h3>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            About Us
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Careers
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Contact
          </a>
        </div>
        <div className="grid gap-2 text-sm">
          <h3 className="font-semibold">Legal</h3>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Security
          </a>
        </div>
        <div className="grid gap-2 text-sm">
          <h3 className="font-semibold">Support</h3>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Help Center
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            FAQs
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground">
            Contact Us
          </a>
        </div>
      </div>
      <div className="border-t py-6">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FlexPay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
