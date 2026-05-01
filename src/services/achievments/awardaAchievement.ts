import { supabase } from "@/lib/supabase/client";
import { logActivity } from "../activity/logActivity";

export async function awardAchievement(
  userId: string,
  achievementKey: string,
  logMessage: {
    title: string;
    description: string;
  },
) {
  const { data: achievement } = await supabase
    .from("achievements")
    .select("id")
    .eq("key", achievementKey)
    .maybeSingle();

  if (!achievement) {
    return;
  }

  const { data: existingAchievement } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .maybeSingle();

  if (existingAchievement) {
    return;
  }

  const { error: achievementError } = await supabase
    .from("user_achievements")
    .insert({ user_id: userId, achievement_id: achievement.id, achievement_key: achievementKey });

  if (achievementError) {
    console.error(
      `[awardachievement] achievement award error for achievement ${achievementKey}:`,
      achievementError,
    );
  }

  await logActivity({
    type: "ACHIEVEMENT_EARNED",
    title: logMessage.title,
    description: logMessage.description,
    entityId: achievement.id,
    entityType: "achievement",
    metadata: { achievementKey },
  });
}
