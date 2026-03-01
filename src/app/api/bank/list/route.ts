import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency");

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Paystack key not configured" }, { status: 500 });
  }

  const params = new URLSearchParams({ perPage: "100", use_cursor: "false" });
  if (currency) params.set("currency", currency);

  try {
    const response = await fetch(`https://api.paystack.co/bank?${params}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Failed to fetch banks" }, { status: 503 });
  }
}
