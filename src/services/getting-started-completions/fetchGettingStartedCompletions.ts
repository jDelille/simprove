import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const fetchGettingStartedCompletions = async (
  userId: string,
  supabaseClient?: SupabaseClient
) => {
  const supabase = supabaseClient ?? createClient();

  const { data: completions, error } = await supabase
    .from("getting_started_completions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching getting started completions:", error);
    throw error;
  }

  return completions ?? [];
};