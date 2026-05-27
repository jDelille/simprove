import { SupabaseClient } from "@supabase/supabase-js";
import { uploadLeaderboard } from "../leaderboard/uploadLeaderboard";
import { getRankFromPoints } from "@/lib/points/getRankFromPoints";
import { createClient } from "@/lib/supabase/client";

export const awardUserPoints = async (
  userId: string,
  pointsToAdd: number,
  supabaseClient?: SupabaseClient
) => {
  const supabase = supabaseClient ?? createClient();

  const { data: existingPoints, error: fetchError } = await supabase
    .from("user_points")
    .select("total_points")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error fetching user points:", fetchError);
    return { error: fetchError };
  }

  const currentPoints = existingPoints?.total_points ?? 0;
  const newPoints = currentPoints + pointsToAdd;

  const { error: upsertError } = await supabase
    .from("user_points")
    .upsert(
      {
        user_id: userId,
        total_points: newPoints,
      },
      { onConflict: "user_id" }
    );

  if (upsertError) {
    console.error("Error updating user points:", upsertError);
    return { error: upsertError };
  }

  const oldRank = getRankFromPoints(currentPoints);
  const newRank = getRankFromPoints(newPoints);

  if (oldRank.rank !== newRank.rank) {
    await supabase
      .from("users")
      .update({ rank: newRank.rank })
      .eq("id", userId);
  }

  await uploadLeaderboard(supabase, pointsToAdd, userId);

  return { newPoints };
};