import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as browserClient } from "@/lib/supabase/client";

export const uploadUserPoints = async (
  userId: string,
  supabaseClient: SupabaseClient = browserClient,
  pointsToAdd: number
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
      .upsert({ user_id: userId, total_points: newPoints }, { onConflict: "user_id" })
      .select()
      .maybeSingle();

    if (upsertError) {
      console.error("Error updating user points:", upsertError);
      return { error: upsertError };
    }

    return { newPoints };
};