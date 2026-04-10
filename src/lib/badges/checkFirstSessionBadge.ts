import { awardBadge } from "@/services/badges/awardBadge";
import { SupabaseClient } from "@supabase/supabase-js";

export const checkFirstSessionBadge = async (
  userId: string,
  supabaseClient: SupabaseClient,
  isFirstSession: boolean,
): Promise<void> => {
  if (!isFirstSession) return;

  const { data: badgeCheck, error } = await supabaseClient
    .from("user_badges")
    .select("*")
    .eq("user_id", userId)
    .eq("badge_key", "first_session")
    .maybeSingle();

  if (error) {
    console.error("[checkFirstSessionBadge] error:", error);
    return;
  }

  if (!badgeCheck) {
    await awardBadge(userId, "first_session", {
      title: "First Session Logged",
      description: "Imported your first session",
    });
  }
};