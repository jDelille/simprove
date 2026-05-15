import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServer } from "@/lib/supabase/server";

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
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Missing token" },
        {
          status: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    const supabase = await createSupabaseServer();

    // 1. Find user by sync token
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username")
      .eq("sync_token", token)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        {
          status: 401,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // 2. Ensure only ONE active session per user
    await supabase
      .from("extension_connections")
      .delete()
      .eq("userId", user.id);

    // 3. Create new session
    const sessionId = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("extension_connections")
      .insert({
        userId: user.id,
        sessionId,
        lastActiveAt: new Date().toISOString(),
      });

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        { success: false, message: "Failed to create session" },
        {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        }
      );
    }

    // 4. Return session to extension
    return NextResponse.json(
      {
        success: true,
        sessionId,
        user: {
          id: user.id,
          username: user.username,
        },
      },
      {
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  } catch (err) {
    console.error("Extension connect error:", err);

    return NextResponse.json(
      { success: false, message: "Server error" },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}