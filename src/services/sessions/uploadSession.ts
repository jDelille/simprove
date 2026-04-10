import { supabase } from "@/lib/supabase/client";
import { logActivity } from "../activity/logActivity";
import { calculateAverages } from "@/lib/shots/averages";
import { fetchAIRecommendedLessons } from "@/claude-ai/fetchAIRecommendedLessons";
import { Shot } from "@/types/shot";
import { checkFirstSession } from "@/lib/sessions/checkFirstSession";
import { uploadSessionToStorage } from "@/lib/sessions/uploadSessionToStorage";
import { insertSession } from "@/lib/sessions/insertSession";
import { handleFirstSessionOnboarding } from "@/lib/onboarding/handleFirstSessionOnboarding";
import { checkFirstSessionBadge } from "@/lib/badges/checkFirstSessionBadge";
import { getActiveLessonId } from "@/lib/lessons/getActiveLessonId";
import { getLessonDrills } from "@/lib/lessons/getLessonDrills";
import { applySessionToLessonDrills } from "@/lib/lessons/applySessionToLessonDrills";
import { uploadUserPoints } from "../user-points/uploadUserPoints";
import { uploadLeaderboard } from "../leaderboard/uploadLeaderboard";

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

export type SessionData = {
  shots: Shot[];
};

type ShotNumericMetrics = "carry" | "ballSpeed" | "vla" | "peakHeight";

type LessonDrill = {
  id: string;
  metric: ShotNumericMetrics;
  operator: string;
  target_value: number;
  required_successful_shots: number;
  points: number;
  drill_order: number;
};

export type UserDrill = {
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

  // Check if this is the first session BEFORE inserting
  const isFirstSession = await checkFirstSession(userId);

  // Upload session JSON to storage
  await uploadSessionToStorage(supabase, filePath, jsonString);

  // Insert session into DB
  const { data: dbSession, error } = await insertSession(userId, supabase, {
    session_name: sessionName,
    session_date: sessionDate,
    file_path: filePath,
  });

  if (error || !dbSession) {
    throw new Error("Failed to create session record");
  }

  // Log activity
  await logActivity({
    type: "SESSION_CREATED",
    title: "Session Uploaded",
    description: `Uploaded session "${sessionName}"`,
    entityId: dbSession.id,
    entityType: "session",
  });

  // Handle first session onboarding
  await handleFirstSessionOnboarding(userId, supabase, isFirstSession);

  // Check for first session badge
  await checkFirstSessionBadge(userId, supabase, isFirstSession);

  // Get active lessonId for user
  const activeLessonId = await getActiveLessonId(userId, supabase);

  const newSessionPoints = 100;

  // Award user points for session upload
  await uploadUserPoints(userId, supabase, newSessionPoints);

  // Update leaderboard with new points
  await uploadLeaderboard(supabase, newSessionPoints, userId);

  if (activeLessonId) {
    let sessionData: SessionData;

    try {
      sessionData = JSON.parse(jsonString);
    } catch (e) {
      console.error("[uploadSession] Failed to parse session JSON:", e);
      throw new Error("Invalid session JSON");
    }

    const shots: Shot[] = sessionData.shots ?? [];

    // Get lesson drills
    const rawDrills = await getLessonDrills(userId, supabase, activeLessonId);
    const userDrills = rawDrills as UserDrill[] | null;

    // Apply session data to lesson drills
    await applySessionToLessonDrills(
      supabase,
      userDrills,
      shots,
      activeLessonId,
    );
  }

  // AI Lesson Recommendations
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
