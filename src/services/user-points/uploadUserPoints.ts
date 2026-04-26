import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient, supabase } from "@/lib/supabase/client";
import { uploadLeaderboard } from "../leaderboard/uploadLeaderboard";
import { getRankFromPoints } from "@/lib/points/getRankFromPoints";

export const awardUserPoints = async (
  userId: string,
  supabaseClient: SupabaseClient = browserClient,
  pointsToAdd: number,
) => {
  // Fetch current points
  const { data: existingPoints, error: fetchError } = await supabaseClient
    .from("user_points")
    .select("total_points")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching user points:", fetchError);
    return { error: fetchError };
  }

  const currentPoints = existingPoints?.total_points || 0;

  // Increment points
  const newPoints = currentPoints + pointsToAdd;

  // Upsert the new points value
  const { data, error: upsertError } = await supabaseClient
    .from("user_points")
    .upsert(
      { user_id: userId, total_points: newPoints },
      { onConflict: "user_id" },
    )
    .select()
    .maybeSingle();

  if (upsertError) {
    console.error("Error updating user points:", upsertError);
    return { error: upsertError };
  }

  const newTotal = currentPoints + pointsToAdd;
  const newRank = getRankFromPoints(newTotal);
  const oldRank = getRankFromPoints(currentPoints);

  if (newRank.rank !== oldRank.rank) {
  await supabase
    .from('users')
    .update({ rank: newRank.rank })
    .eq('id', userId);
}

  await uploadLeaderboard(supabaseClient, pointsToAdd, userId);

  return { newPoints };
};
