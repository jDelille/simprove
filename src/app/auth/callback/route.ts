import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!code) return NextResponse.redirect(`${origin}/auth/login`);

  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.session) {
    console.error("Error exchanging code for session:", error);
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
  }

  const userId = data.session.user.id;

  // 1️⃣ Try to fetch profile
  let { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  // 2️⃣ If profile doesn't exist, create a new row
  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email: data.session.user.email,
        display_name: data.session.user.user_metadata.full_name || "",
        launch_monitor: null,
        location: null,
      })
      .select("id, email, display_name, launch_monitor, location")
      .single();

    if (insertError) {
      console.error("Error creating user profile:", insertError);
      return NextResponse.redirect(
        `${origin}/auth/login?error=profile_create_failed`,
      );
    }

    profile = newProfile;
  }

  const needsOnboarding =
    !profile?.launch_monitor || !profile?.location || !profile?.display_name;


  // Redirect to onboarding if needed
  if (needsOnboarding) {
    return NextResponse.redirect(`${origin}/auth/signup?step=3`);
  }

  // Otherwise redirect to dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}
