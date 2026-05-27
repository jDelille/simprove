import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const fetchUserPoints = async (
  userId: string,
  supabaseClient?: SupabaseClient,
) => {
  const supabase = supabaseClient ?? createClient();

  const { data: totalPoints, error: totalError } = await supabase
    .from("user_points")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (totalError) {
    console.error("Error fetching user points:", totalError);
    return {
      totalPoints: 0,
      weeklyPoints: 0,
      error: totalError,
    };
  }

  const { data: weeklyPoints, error: weeklyError } = await supabase
    .from("leaderboard")
    .select("points")
    .eq("user_id", userId)
    .eq("period_type", "weekly")
    .maybeSingle();

  if (weeklyError) {
    console.error("Error fetching weekly points:", weeklyError);
    return {
      totalPoints: totalPoints?.total_points ?? 0,
      weeklyPoints: 0,
      error: weeklyError,
    };
  }

  return {
    totalPoints: totalPoints?.total_points ?? 0,
    weeklyPoints: weeklyPoints?.points ?? 0,
    error: null,
  };
};