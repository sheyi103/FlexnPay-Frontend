import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const account_number = searchParams.get("account_number");
  const bank_code      = searchParams.get("bank_code");

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Paystack key not configured" }, { status: 500 });
  }

  if (!account_number || !bank_code) {
    return NextResponse.json({ error: "account_number and bank_code are required" }, { status: 400 });
  }

  try {
    const params   = new URLSearchParams({ account_number, bank_code });
    const response = await fetch(`https://api.paystack.co/bank/resolve?${params}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Verification service unavailable" }, { status: 503 });
  }
}
