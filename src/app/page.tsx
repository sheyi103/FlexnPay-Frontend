import { LandingPageClient } from "./LandingPageClient";

// Fetches the default GBP→NGN rate at render time so the Calculator
// can display it immediately without any client-side API call on mount.
// 2-second timeout — page still loads fast even if backend is slow.
async function getInitialRate(): Promise<number | null> {
  try {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) return null;

    const res = await fetch(`${apiUrl}/api/fx/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceAmount: 1,
        sourceCurrency: "GBP",
        destinationCurrency: "NGN",
      }),
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(2000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data.effectiveRate ?? null;
  } catch {
    return null;
  }
}

export default async function LandingPage() {
  const initialRate = await getInitialRate();
  return <LandingPageClient initialRate={initialRate} />;
}
