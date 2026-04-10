import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const checkFirstSession = async (
  userId: string,
  supabaseClient: SupabaseClient = browserClient,
): Promise<boolean> => {
  const { data, error } = await supabaseClient
    .from("sessions")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    console.error("Error fetching prior sessions:", error);
    return false;
  }

  return !data || data.length === 0;
};