import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "../supabase/client";

const supabase = createClient();

export const checkFirstSession = async (
  userId: string,
  supabaseClient: SupabaseClient = supabase,
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
