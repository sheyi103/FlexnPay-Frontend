import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json({ message: "API_URL is not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("Authorization");

  try {
    const response = await fetch(`${apiUrl}/api/payment/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
    return NextResponse.json(
      { message: isTimeout ? "Payment service timed out" : "Payment service unavailable" },
      { status: 503 },
    );
  }
}
