"use client";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { type FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout }                    = useAuth();
  const router                              = useRouter();

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  const navLinkClass =
    "transition-colors hover:text-foreground/80 text-foreground";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/flexpay-logo.svg" alt="FlexPay" className="h-24 w-24" />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#" onClick={(e) => { e.preventDefault(); handleScroll("how-it-works"); }} className={navLinkClass}>About</a>
              <a href="#features" onClick={(e) => { e.preventDefault(); handleScroll("features"); }} className={navLinkClass}>Features</a>
              <a href="#cta" onClick={(e) => { e.preventDefault(); handleScroll("cta"); }} className={navLinkClass}>Download</a>
            </nav>
          </div>

          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden md:block text-sm text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" className="hidden md:inline-flex" asChild>
                  <Link href="/topup">Top Up</Link>
                </Button>
                <Button variant="outline" className="hidden md:inline-flex" onClick={handleLogout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden md:inline-flex" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button className="hidden md:inline-flex" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          <a href="#" onClick={(e) => { e.preventDefault(); handleScroll("how-it-works"); }} className={navLinkClass}>About</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); handleScroll("features"); }} className={navLinkClass}>Features</a>
          <a href="#cta" onClick={(e) => { e.preventDefault(); handleScroll("cta"); }} className={navLinkClass}>Download</a>
          {user ? (
            <>
              <span className="text-muted-foreground text-xs">{user.email}</span>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/topup" onClick={() => setMobileMenuOpen(false)}>Top Up</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleLogout}>Log Out</Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
