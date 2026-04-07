import { createSupabaseServer } from "@/lib/supabase/server"; 
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (code) {
    const supabase = await createSupabaseServer(); 
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !data.session) {
      console.error("Error exchanging code for session:", error);
      return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.session.user.id)
      .single();

      console.log(profile)

    if (!profile?.launch_monitor) {
      return NextResponse.redirect(`${origin}/auth/signup?step=3`);
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}