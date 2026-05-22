import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const fetchLeaderboard = async (
  supabaseClient: SupabaseClient = browserClient,
  period: string = "weekly"
) => {
  const { data, error } = await supabaseClient
    .from("users")
    .select(`
      id,
      username,
      display_name,
      avatar_path,
      avatar_color,
      leaderboard(points, period_type)
    `);

  if (error) {
    console.error("Error fetching leaderboard data:", error);
    return { leaderboardData: null, error };
  }

  const leaderboardData = (data ?? []).map((user) => {
    const entry = user.leaderboard?.find(
      (l: any) => l.period_type === period
    );

    return {
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      avatar_path: user.avatar_path,
      avatar_color: user.avatar_color,
      points: entry?.points ?? 0,
      period_type: period,
    };
  });

  return { leaderboardData, error: null };
};