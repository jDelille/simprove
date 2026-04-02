import { supabase } from "@/lib/supabase/client";
import { logActivity } from "../activity/logActivity";
import { evaluate } from "@/lib/evalulateSession";
import { drillProgress } from "@/lib/drillProgress";

type UploadSessionProps = {
  userId: string;
  jsonString: string;
  sessionName: string;
  sessionDate: string;
};

type Session = {
  id: string;
  user_id: string;
  session_name: string;
  session_date: string;
  storage_path: string;
  categories: string[];
};

type LessonDrill = {
  id: string;
  metric: string;
  operator: string;
  target_value: number;
  required_successful_shots: number;
  points: number;
  drill_order: number;
};

type UserDrill = {
  id: string;
  status: string;
  progress_value: number;
  lesson_drills: LessonDrill; // ← single object, not array
};

export async function uploadSession({
  userId,
  jsonString,
  sessionName,
  sessionDate,
}: UploadSessionProps): Promise<Session> {
  const filePath = `sessions/${userId}/${Date.now()}.json`;

  // ─── 1. Upload session JSON to storage ────────────────────────────────────
  // const { error: uploadError } = await supabase.storage
  //   .from("sessions")
  //   .upload(filePath, new Blob([jsonString], { type: "application/json" }), {
  //     cacheControl: "no-cache",
  //     upsert: true,
  //   });

  // if (uploadError) {
  //   console.error("[uploadSession] Storage upload error:", uploadError);
  //   throw uploadError;
  // }

  // ─── 2. Insert session into DB ─────────────────────────────────────────────
  // const { data: dbSession, error: dbError } = await supabase
  //   .from("sessions")
  //   .insert({
  //     user_id: userId,
  //     session_name: sessionName,
  //     session_date: sessionDate,
  //     storage_path: filePath,
  //     categories: ["all"],
  //   })
  //   .select()
  //   .single();

  // if (dbError || !dbSession) {
  //   console.error("[uploadSession] DB insert error:", dbError);
  //   throw new Error("Session not created properly");
  // }

  // ─── 3. Award "first swing" badge if not already earned ───────────────────
  const { data: badge } = await supabase
    .from("badges")
    .select("id")
    .eq("key", "first_swing")
    .single();

  if (badge) {
    const { data: existingBadge } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", userId)
      .eq("badge_id", badge.id)
      .single();

    if (!existingBadge) {
      const { error: badgeError } = await supabase
        .from("user_badges")
        .insert({ user_id: userId, badge_id: badge.id });

      if (badgeError) {
        console.error("[uploadSession] Badge award error:", badgeError);
      } else {
        await logActivity({
          type: "BADGE_EARNED",
          title: `Awarded badge: First Swing`,
          description: `Uploaded your first session`,
          entityId: badge.id,
          entityType: "badge",
          metadata: { badgeName: "First Swing" },
        });
      }
    }
  }

  // ─── 4. Check for an active lesson ────────────────────────────────────────
  const { data: activeLesson, error: lessonError } = await supabase
    .from("user_lessons")
    .select("id, lesson_id")
    .eq("status", "active")
    .eq("user_id", userId)
    .single();

  if (lessonError && lessonError.code !== "PGRST116") {
    console.error("[uploadSession] Error fetching active lesson:", lessonError);
  }

  if (activeLesson) {
    let sessionData: { shots: Record<string, any>[] };

    try {
      sessionData = JSON.parse(jsonString);
    } catch (e) {
      console.error("[uploadSession] Failed to parse session JSON:", e);
      throw new Error("Invalid session JSON");
    }

    const shots = sessionData.shots ?? [];
    console.log(
      `[uploadSession] Processing ${shots.length} shots for lesson ${activeLesson.id}`,
    );

    // ─── 5. Fetch active/locked drills ────────────────────────────────────
    const { data: rawDrills, error: drillFetchError } = await supabase
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
      .eq("user_lesson_id", activeLesson.id)
      .in("status", ["active", "locked"]);

    if (drillFetchError) {
      console.error("[uploadSession] Error fetching drills:", drillFetchError);
    }

    console.log(
      "[uploadSession] rawDrills:",
      JSON.stringify(rawDrills, null, 2),
    );

    const userDrills = rawDrills as UserDrill[] | null;

    if (userDrills && userDrills.length > 0) {
      // Sort by drill_order in JS
      const sorted = [...userDrills].sort(
        (a, b) =>
          (a.lesson_drills?.drill_order ?? 0) -
          (b.lesson_drills?.drill_order ?? 0),
      );

      // ─── 6. Update each drill based on session shots ───────────────────
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

        const successfulShots = shots.filter((shot) =>
          evaluate(shot[metric], operator, target_value),
        ).length;

        const existingCount = Math.round(
          ((drill.progress_value || 0) / 100) * required_successful_shots,
        );
        const newTotal = existingCount + successfulShots;

        console.log(
          `[uploadSession] Drill ${drill.id} | metric: ${metric} | successful this session: ${successfulShots} | existing count: ${existingCount} | new total: ${newTotal}/${required_successful_shots}`,
        );

        if (newTotal >= required_successful_shots) {
          const { error: completeError } = await supabase
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
          } else {
            console.log(
              `[uploadSession] Drill ${drill.id} marked completed ✅`,
            );
          }
        } else {
          const { error: progressError } = await supabase
            .from("user_lesson_drills")
            .update({
              progress_value: drillProgress(
                newTotal,
                required_successful_shots,
              ),
            })
            .eq("id", drill.id);

          if (progressError) {
            console.error(
              `[uploadSession] Failed to update progress for drill ${drill.id}:`,
              progressError,
            );
          } else {
            console.log(
              `[uploadSession] Drill ${drill.id} progress updated to ${newTotal}/${required_successful_shots}`,
            );
          }
        }
      }

      // ─── 7. Activate the next locked drill ────────────────────────────
      const { data: nextDrill, error: nextDrillError } = await supabase
        .from("user_lesson_drills")
        .select("id")
        .eq("user_lesson_id", activeLesson.id)
        .eq("status", "locked")
        .limit(1)
        .single();

      if (nextDrillError && nextDrillError.code !== "PGRST116") {
        console.error(
          "[uploadSession] Error fetching next locked drill:",
          nextDrillError,
        );
      }

      if (nextDrill) {
        const { error: activateError } = await supabase
          .from("user_lesson_drills")
          .update({ status: "active" })
          .eq("id", nextDrill.id);

        if (activateError) {
          console.error(
            "[uploadSession] Failed to activate next drill:",
            activateError,
          );
        } else {
          console.log(
            `[uploadSession] Next drill ${nextDrill.id} activated ✅`,
          );
        }
      }

      // ─── 8. Complete lesson if all drills are done ─────────────────────
      const { count: remaining, error: countError } = await supabase
        .from("user_lesson_drills")
        .select("id", { count: "exact", head: true })
        .eq("user_lesson_id", activeLesson.id)
        .not("status", "eq", "completed");

      if (countError) {
        console.error(
          "[uploadSession] Error counting remaining drills:",
          countError,
        );
      } else if (remaining === 0) {
        const { error: lessonCompleteError } = await supabase
          .from("user_lessons")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", activeLesson.id);

        if (lessonCompleteError) {
          console.error(
            "[uploadSession] Failed to complete lesson:",
            lessonCompleteError,
          );
        } else {
          console.log(`[uploadSession] Lesson ${activeLesson.id} completed ✅`);
        }
      }
    }
  }

  return {
    id: "mock-session-id",
    user_id: userId,
    session_name: sessionName,
    session_date: sessionDate,
    storage_path: filePath,
    categories: ["all"],
  };

  // return dbSession;
}
