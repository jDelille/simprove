export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { pendingRounds } from "@/lib/gspro/store";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {

  console.log("POST HIT", pendingRounds.length);

  try {
    const body = await req.json();
    pendingRounds.push(body);


    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err) {
    console.error("Ingest error:", err);

    return NextResponse.json(
      { success: false },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}


export async function GET() {
  return NextResponse.json(pendingRounds);
}
