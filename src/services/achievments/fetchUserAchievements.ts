import { supabase } from "@/lib/supabase/client";

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
