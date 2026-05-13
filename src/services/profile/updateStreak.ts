import { SupabaseClient } from "@supabase/supabase-js";

export const updateStreak = async (userId: string, supabase: SupabaseClient) => {
  const { data: user } = await supabase
    .from("users")
    .select("streak_current, streak_longest, streak_last_active_at")
    .eq("id", userId)
    .single();

  const now = new Date();
  const last = user?.streak_last_active_at 
    ? new Date(user.streak_last_active_at) 
    : null;

  // get start of current and last week
  const startOfWeek = (d: Date) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(d.getDate() - d.getDay());
    return date;
  };

  const thisWeek = startOfWeek(now).getTime();
  const lastActiveWeek = last ? startOfWeek(last).getTime() : null;

  // already active this week, do nothing
  if (lastActiveWeek === thisWeek) return;

  const prevWeek = thisWeek - 7 * 24 * 60 * 60 * 1000;
  const newStreak = lastActiveWeek === prevWeek 
    ? (user?.streak_current || 0) + 1  // active last week, increment
    : 1;                                // missed a week, reset

  await supabase
    .from("users")
    .update({
      streak_current: newStreak,
      streak_longest: Math.max(newStreak, user?.streak_longest || 0),
      streak_last_active_at: now.toISOString(),
    })
    .eq("id", userId);
};