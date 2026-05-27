import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchAllAchievementGlobalPercentages() {
  const { data: completedRows, error } = await supabase
    .from("user_achievements")
    .select("achievement_id, user_id");

  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  if (error || !totalUsers) {
    console.error(error);
    return [];
  }

  const map: Record<string, Set<string>> = {};

  for (const row of completedRows ?? []) {
    if (!map[row.achievement_id]) {
      map[row.achievement_id] = new Set();
    }
    map[row.achievement_id].add(row.user_id);
  }

  return Object.entries(map).map(([achievementId, users]) => ({
    achievementId,
    percentage: (users.size / totalUsers) * 100
  }));
}