import { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";

export const fetchProfileInfo = async (supabaseClient?: SupabaseClient) => {
  // Use the server client if provided, otherwise create one
  const supabase = supabaseClient ?? (await createSupabaseServer());

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Error fetching user:", userError);
    return { user: null, profile: null };
  }

  if (!user) {
    return { user: null, profile: null };
  }

  // Fetch the profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Error fetching profile:", profileError);
    return { user, profile: null };
  }

  return { user, profile };
};