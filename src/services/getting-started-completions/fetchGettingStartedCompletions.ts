import { createClient } from "@/lib/supabase/client";

export const fetchGettingStartedCompletions = async (
  userId: string
) => {
  const supabase = createClient();

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
