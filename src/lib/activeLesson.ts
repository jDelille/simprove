import { createClient } from "@/lib/supabase/client";
import { fetchActiveLesson as fetchActiveLessonServer } from "@/services/lessons/fetchActiveLesson";

/**
 * Client-side helper to fetch the active lesson for a user.
 * Returns the same structure as server fetch
 */

export async function fetchActiveLessonClient(userId: string) {
  const supabase = createClient();
  const activeLesson = await fetchActiveLessonServer(userId, supabase);
  return activeLesson ?? undefined;
}