import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";
import moment from "moment";

export const fetchUserPoints = async (
  userId: string,
  supabaseClient: SupabaseClient = browserClient,
) => {
  const { data: totalPoints, error: totalError } = await supabaseClient
    .from("user_points")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (totalError) {
    console.error("Error fetching user points:", totalError);
    return { userPoints: null, error: totalError };
  }

  const { data: weeklyPoints, error: weeklyError } = await supabaseClient
    .from("leaderboard")
    .select("points")
    .eq("user_id", userId)
    .eq("period_type", "weekly")
    .limit(1)
    .maybeSingle();

  if (weeklyError) {
    console.error("Error fetching weekly points:", weeklyError);
    return { totalPoints: null, weeklyPoints: null, error: weeklyError };
  }

  const { data: debug } = await supabaseClient
    .from("leaderboard")
    .select("period_start, points")
    .eq("user_id", userId)
    .eq("period_type", "weekly");

  console.log("weekly rows", debug);
  console.log("moment start of week", moment().startOf("week").toISOString());

  return {
    totalPoints: totalPoints?.total_points ?? 0,
    weeklyPoints: weeklyPoints?.points ?? 0,
    error: null,
  };
};
