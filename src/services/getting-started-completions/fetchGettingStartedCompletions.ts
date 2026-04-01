import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const fetchGettingStartedCompletions = async (
  userId: string,
  supabaseClient: SupabaseClient = browserClient
) => {
  console.log("fetchGettingStartedCompletions called");
  const { data: completions, error } = await supabaseClient
    .from("getting_started_completions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching getting started completions:", error);
    throw error;
  }

  return completions ?? [];
};