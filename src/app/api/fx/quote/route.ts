import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const apiUrl = process.env.API_URL;
  console.log("[fx/quote] API_URL =", apiUrl);

  if (!apiUrl) {
    return NextResponse.json({ error: "API_URL is not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiUrl}/api/fx/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
    return NextResponse.json(
      { error: isTimeout ? "Rate service timed out" : "Rate service unavailable" },
      { status: 503 },
    );
  }
}
