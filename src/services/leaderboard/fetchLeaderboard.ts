import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const fetchLeaderboard = async (
  supabaseClient: SupabaseClient = browserClient,
) => {
  const { data: leaderboardData, error } = await supabaseClient
    .from("leaderboard")
    .select(
      `
            *,
            users (
                *
            )`,
    )
    .order("points", { ascending: false });

  if (error) {
    console.error("Error fetching leaderboard data:", error);
    return { leaderboardData: null, error };
  }

  return { leaderboardData, error: null };
};
