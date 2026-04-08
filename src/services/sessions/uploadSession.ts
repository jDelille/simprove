import { supabase } from "@/lib/supabase/client";
import { logActivity } from "../activity/logActivity";
import { evaluate } from "@/lib/evalulateSession";
import { drillProgress } from "@/lib/drillProgress";
import { awardBadge } from "../badges/awardBadge";
import { calculateAverages } from "@/lib/shots/averages";
import { fetchAIRecommendedLessons } from "@/claude-ai/fetchAIRecommendedLessons";
import { Shot } from "@/types/shot";

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
  lesson_drills: LessonDrill;
};

export async function uploadSession({
  userId,
  jsonString,
  sessionName,
  sessionDate,
}: UploadSessionProps): Promise<Session> {
  const filePath = `sessions/${userId}/${Date.now()}.json`;

  // ─── 0. Check if this is the first session BEFORE inserting ──────────────
  const { data: priorSessions } = await supabase
    .from("sessions")
    .select("id")
    .eq("user_id", userId)
    .limit(1);

  const isFirstSession = !priorSessions || priorSessions.length === 0;

  // ─── 1. Upload session JSON to storage ───────────────────────────────────
  const { error: uploadError } = await supabase.storage
    .from("sessions")
    .upload(filePath, new Blob([jsonString], { type: "application/json" }), {
      cacheControl: "no-cache",
      upsert: true,
    });

  if (uploadError) {
    console.error("[uploadSession] Storage upload error:", uploadError);
    throw uploadError;
  }

  // ─── 2. Insert session into DB ───────────────────────────────────────────
  const { data: dbSession, error: dbError } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      session_name: sessionName,
      session_date: sessionDate,
      storage_path: filePath,
      categories: ["all"],
    })
    .select()
    .single();

  if (dbError || !dbSession) {
    console.error("[uploadSession] DB insert error:", dbError);
    throw new Error("Session not created properly");
  }

  // log activity
  await logActivity({
    type: "SESSION_CREATED",
    title: "Session Uploaded",
    description: `Uploaded session "${sessionName}"`,
    entityId: dbSession.id,
    entityType: "session",
  });

  // ─── 3. Handle first session onboarding ──────────────────────────────────
  if (isFirstSession) {
    const { data: completion } = await supabase
      .from("getting_started_completions")
      .select("*")
      .eq("user_id", userId)
      .eq("step_id", 2)
      .maybeSingle();

    if (!completion) {
      const { error: completionError } = await supabase
        .from("getting_started_completions")
        .insert({
          user_id: userId,
          step_id: 2,
        });

      if (completionError) {
        console.error(
          "[uploadSession] Failed to mark onboarding step 2:",
          completionError,
        );
      }
    }

    const { data: badgeCheck } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .eq("badge_key", "first_swing")
      .maybeSingle();

    if (!badgeCheck) {
      await awardBadge(userId, "first_swing", {
        title: "First Session Logged",
        description: "Imported your first session",
      });
    }
  }

  // ─── 4. Active lesson drills logic ───────────────────────────────────────
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

    const userDrills = rawDrills as UserDrill[] | null;

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

        const successfulShots = shots.filter((shot) =>
          evaluate(shot[metric], operator, target_value),
        ).length;

        const existingCount = Math.round(
          ((drill.progress_value || 0) / 100) * required_successful_shots,
        );
        const newTotal = existingCount + successfulShots;

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
          }
        }
      }

      const { data: nextDrill, error: nextDrillError } = await supabase
        .from("user_lesson_drills")
        .select("id")
        .eq("user_lesson_id", activeLesson.id)
        .eq("status", "locked")
        .limit(1)
        .single();

      if (!nextDrillError && nextDrill) {
        const { error: activateError } = await supabase
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

      const { count: remaining, error: countError } = await supabase
        .from("user_lesson_drills")
        .select("id", { count: "exact", head: true })
        .eq("user_lesson_id", activeLesson.id)
        .not("status", "eq", "completed");

      if (!countError && remaining === 0) {
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
        }
      }
    }
  }

  // ─── 5. AI Lesson Recommendations ───────────────────────────────────────
  try {
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("id, lesson_name, lesson_description, lesson_difficulty");

    if (allLessons && allLessons.length > 0) {
      const sessionData = JSON.parse(jsonString);
      const shots = sessionData.shots ?? [];
      const validShots = shots.filter(
        (shot: Shot) =>
          shot.vla > 0 &&
          shot.carry > 0 &&
          shot.ballSpeed > 0 &&
          shot.peakHeight > 0,
      );

      const hasClubData = validShots.some(
        (s: Shot) => s.vla && s.vla !== -0.01 && s.vla > 0,
      );

      const averages = calculateAverages(validShots);

      await fetchAIRecommendedLessons(
        userId,
        {
          avgCarry: averages.avgCarry,
          avgSpeed: averages.avgSpeed,
          avgOffline: averages.avgOffline,
          avgVLA: averages.avgLaunchAngle,
          avgFaceToTarget: averages.avgfaceToTarget,
          avgBackSpin: averages.avgSpin,
          avgPeakHeight: averages.avgPeakHeight,
          totalShots: averages.count,
          hasClubData,
        },
        allLessons,
      );
    }
  } catch (e) {
    console.error("[uploadSession] AI recommendation error:", e);
  }

  return dbSession;
}
