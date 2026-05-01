import { SupabaseClient } from "@supabase/supabase-js";

export const getLessonDrills = async (
  userId: string,
  supabaseClient: SupabaseClient,
  activeLessonId: string,
): Promise<any> => {
  const { data: rawDrills, error: drillFetchError } = await supabaseClient
    .from("user_lesson_drills")
    .select(
      `
        id,
        status,
        progress_value,
        lesson_drills (
          id,
          metric,
          operator,
          target_value,
          required_successful_shots,
          points,
          drill_order
        )
      `,
    )
    .eq("user_lesson_id", activeLessonId)
    .in("status", ["active", "locked"]);

  if (drillFetchError) {
    console.error("[uploadSession] Error fetching drills:", drillFetchError);
  }

  return rawDrills;
};
