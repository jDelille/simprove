import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const supabase = createClient();

export const fetchGettingStartedCompletions = async (
  userId: string,
  supabaseClient: SupabaseClient = supabase
) => {
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