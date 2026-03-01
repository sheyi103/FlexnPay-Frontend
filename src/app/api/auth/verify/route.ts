import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json({ message: "API_URL is not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(`${apiUrl}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    const isTimeout = err instanceof DOMException && err.name === "TimeoutError";
    return NextResponse.json(
      { message: isTimeout ? "Auth service timed out" : "Auth service unavailable" },
      { status: 503 },
    );
  }
}
