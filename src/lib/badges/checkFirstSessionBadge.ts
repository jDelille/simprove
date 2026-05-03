import { awardAchievement } from "@/services/achievments/awardAchievement";
import { SupabaseClient } from "@supabase/supabase-js";

export const checkFirstSessionAchievement = async (
  userId: string,
  supabaseClient: SupabaseClient,
  isFirstSession: boolean,
): Promise<void> => {
  if (!isFirstSession) return;

  const { data: acheievementCheck, error } = await supabaseClient
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId)
    .eq("acheievement_key", "first_session")
    .maybeSingle();

  if (error) {
    console.error("[checkFirstSessionAcheievement] error:", error);
    return;
  }

  if (!acheievementCheck) {
    await awardAchievement(userId, "first_session", {
      title: "First Session Logged",
      description: "Imported your first session",
    });
  }
};