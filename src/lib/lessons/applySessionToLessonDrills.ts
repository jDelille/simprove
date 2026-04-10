import { UserDrill } from "@/services/sessions/uploadSession";
import { Shot } from "@/types/shot";
import { SupabaseClient } from "@supabase/supabase-js";
import { evaluate } from "../evalulateSession";
import { drillProgress } from "../drillProgress";

export const applySessionToLessonDrills = async (
  supabaseClient: SupabaseClient,
  userDrills: UserDrill[] | null,
  shots: Shot[],
  activeLessonId: string,
): Promise<void> => {

  if (userDrills && userDrills.length > 0) {

    const sorted = [...userDrills].sort(
      (a, b) =>
        (a.lesson_drills?.drill_order ?? 0) -
        (b.lesson_drills?.drill_order ?? 0),
    );

    for (const drill of sorted) {
      const drillData = drill.lesson_drills;

      if (!drillData) {
        console.warn(
          `[uploadSession] Drill ${drill.id} has no lesson_drills data, skipping`,
        );
        continue;
      }

      const {
        metric,
        operator,
        target_value,
        required_successful_shots,
        points,
      } = drillData;

      const successfulShots = shots.filter((shot: Shot) =>
        evaluate(shot[metric], operator, target_value),
      ).length;

      const existingCount = Math.round(
        ((drill.progress_value || 0) / 100) * required_successful_shots,
      );
      const newTotal = existingCount + successfulShots;

      if (newTotal >= required_successful_shots) {
        const { error: completeError } = await supabaseClient
          .from("user_lesson_drills")
          .update({
            status: "completed",
            progress_value: 100,
            score: points,
            completed_at: new Date().toISOString(),
          })
          .eq("id", drill.id);

        if (completeError) {
          console.error(
            `[uploadSession] Failed to complete drill ${drill.id}:`,
            completeError,
          );
        }
      } else {
        const { error: progressError } = await supabaseClient
          .from("user_lesson_drills")
          .update({
            progress_value: drillProgress(newTotal, required_successful_shots),
          })
          .eq("id", drill.id);

        if (progressError) {
          console.error(
            `[uploadSession] Failed to update progress for drill ${drill.id}:`,
            progressError,
          );
        }
      }
    }

    const { data: nextDrill, error: nextDrillError } = await supabaseClient
      .from("user_lesson_drills")
      .select("id")
      .eq("user_lesson_id", activeLessonId)
      .eq("status", "locked")
      .limit(1)
      .single();

    if (!nextDrillError && nextDrill) {
      const { error: activateError } = await supabaseClient
        .from("user_lesson_drills")
        .update({ status: "active" })
        .eq("id", nextDrill.id);

      if (activateError) {
        console.error(
          "[uploadSession] Failed to activate next drill:",
          activateError,
        );
      }
    }

    const { count: remaining, error: countError } = await supabaseClient
      .from("user_lesson_drills")
      .select("id", { count: "exact", head: true })
      .eq("user_lesson_id", activeLessonId)
      .not("status", "eq", "completed");

    if (!countError && remaining === 0) {
      const { error: lessonCompleteError } = await supabaseClient
        .from("user_lessons")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", activeLessonId);

      if (lessonCompleteError) {
        console.error(
          "[uploadSession] Failed to complete lesson:",
          lessonCompleteError,
        );
      }
    }
  }
};
