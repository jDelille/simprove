import { awardBadge } from "@/services/badges/awardBadge";
import { SupabaseClient } from "@supabase/supabase-js";

export const getActiveLessonId = async (
  userId: string,
  supabaseClient: SupabaseClient,
): Promise<string | null> => {

 const { data: activeLesson, error: lessonError } = await supabaseClient
    .from("user_lessons")
    .select("id, lesson_id")
    .eq("status", "active")
    .eq("user_id", userId)
    .maybeSingle();


    if (lessonError && lessonError.code !== "PGRST116") {
        console.error("[getActiveLessonId] error:", lessonError);
        return null;
    }

    return activeLesson ? activeLesson.lesson_id : null;
};