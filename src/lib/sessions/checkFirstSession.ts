import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const checkFirstSession = async (
  userId: string,
  supabaseClient?: SupabaseClient,
): Promise<boolean> => {
  const supabase = supabaseClient ?? createClient();

  const { data, error } = await supabase
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