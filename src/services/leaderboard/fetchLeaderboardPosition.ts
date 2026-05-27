import { createClient } from "@/lib/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

const supabase = createClient();

export const fetchUserLeaderboardPosition = async (
  userId: string,
  supabaseClient: SupabaseClient = supabase,
  period: string = "weekly"
) => {
  const { data, error } = await supabaseClient
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

  // Match leaderboard page behavior
  const leaderboard = (data ?? []).map((user) => {
    const entry = user.leaderboard?.find(
      (l: any) => l.period_type === period
    );

    return {
      user_id: String(user.id),
      points: Number(entry?.points ?? 0),
    };
  });

  // Sort descending by points
  leaderboard.sort((a, b) => b.points - a.points);

  // Assign ranks with tie handling
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

  // Find user
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