export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pendingRounds } from "@/lib/gspro/store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// ✅ Preflight request (Chrome extension triggers this)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// ✅ POST: receive data from extension
export async function POST(req: Request) {
  try {
    const body = await req.json();

    pendingRounds.push(body);

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("Ingest error:", err);

    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// ✅ GET: frontend polling
export async function GET() {
  return NextResponse.json(pendingRounds, {
    headers: corsHeaders,
  });
}