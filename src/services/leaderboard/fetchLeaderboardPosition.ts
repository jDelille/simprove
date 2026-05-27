import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const fetchUserLeaderboardPosition = async (
  userId: string,
  period: string = "weekly",
  supabaseClient?: SupabaseClient,
) => {
  const supabase = supabaseClient ?? createClient();

  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      leaderboard(points, period_type)
    `);

  if (error) {
    console.error("Error fetching leaderboard position:", error);

    return {
      position: null,
      points: null,
      error,
    };
  }

  const leaderboard = (data ?? []).map((user) => {
    const entry = user.leaderboard?.find(
      (l: any) => l.period_type === period
    );

    return {
      user_id: String(user.id),
      points: Number(entry?.points ?? 0),
    };
  });

  leaderboard.sort((a, b) => b.points - a.points);

  let currentRank = 0;
  let previousPoints: number | null = null;

  const ranked = leaderboard.map((entry, index) => {
    if (entry.points !== previousPoints) {
      currentRank = index + 1;
      previousPoints = entry.points;
    }

    return {
      ...entry,
      rank: currentRank,
    };
  });

  const userEntry = ranked.find(
    (entry) => entry.user_id === String(userId)
  );

  if (!userEntry) {
    return {
      position: null,
      points: 0,
      error: null,
    };
  }

  return {
    position: userEntry.rank,
    points: userEntry.points,
    error: null,
  };
};