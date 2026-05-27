import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function fetchUserAchievements(userId: string): Promise<any[]> {
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select(`*, achievements (*)`)
    .eq("user_id", userId);

  if (!userAchievements) {
    return [];
  }

  return userAchievements ?? [];
}
