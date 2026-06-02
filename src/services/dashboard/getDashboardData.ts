import { SupabaseClient } from "@supabase/supabase-js";
import { fetchSessions } from "../sessions/fetchSessions";
import { fetchGettingStartedCompletions } from "../getting-started-completions/fetchGettingStartedCompletions";
import { fetchProfileInfo } from "../profile-info/fetchProfileInfo";
import { fetchActiveLesson } from "../lessons/fetchActiveLesson";
import { fetchUserPoints } from "../user-points/fetchUserPoints";
import { fetchLatestRound } from "../gspro/fetchLatestRound";
import { fetchRounds } from "../gspro/fetchRounds";
import { fetchAITakeaway } from "@/claude-ai/fetchAITakeaway";

type Props = {
  supabase: SupabaseClient;
  userId: string;
};

export const getDashboardData = async ({ supabase, userId }: Props) => {
  const [
    sessions,
    gettingStartedCompletions,
    profileInfo,
    activeLesson,
    userPoints,
    latestRound,
    rounds,
  ] = await Promise.all([
    fetchSessions(userId, supabase).catch((e) => {
      console.error("fetchSessions failed:", e);
      return [];
    }),
    fetchGettingStartedCompletions(userId, supabase).catch((e) => {
      console.error("fetchGettingStartedCompletions failed:", e);
      return [];
    }),
    fetchProfileInfo({ supabaseClient: supabase }).catch((e) => {
      console.error("fetchProfileInfo failed:", e);
      return null;
    }),
    fetchActiveLesson(userId, supabase).catch((e) => {
      console.error("fetchActiveLesson failed:", e);
      return null;
    }),
    fetchUserPoints(userId, supabase).catch((e) => {
      console.error("fetchUserPoints failed:", e);
      return null;
    }),
    fetchLatestRound(userId, supabase).catch((e) => {
      console.error("fetchLatestRound failed:", e);
      return null;
    }),
    fetchRounds(userId, supabase).catch((e) => {
      console.error("fetchRounds failed:", e);
      return [];
    }),
  ]);

  const shots = sessions.flatMap((s: any) => s.shots || []);
  console.log(shots)

  const rightMisses = shots.filter((s: any) => s.offline > 5);
  const leftMisses = shots.filter((s: any) => s.offline < -5);

  const severeRightMisses = shots.filter((s: any) => s.offline > 20);
  const severeLeftMisses = shots.filter((s: any) => s.offline < -20);

  const takeawayStats = {
    totalShots: shots.length,

    avgPath: shots.reduce((a, s) => a + (s.path || 0), 0) / shots.length || 0,

    avgFaceToTarget:
      shots.reduce((a, s) => a + (s.faceToTarget || 0), 0) / shots.length || 0,
    
    avgFaceToPath:
      shots.reduce((a, s) => a + (s.faceToPath || 0), 0) / shots.length || 0,

    rightMisses: rightMisses.length,
    leftMisses: leftMisses.length,

    severeRightMisses: severeRightMisses.length,
    severeLeftMisses: severeLeftMisses.length,

    avgRightMiss:
      rightMisses.length > 0
        ? rightMisses.reduce((a, s) => a + s.offline, 0) / rightMisses.length
        : 0,

    avgLeftMiss:
      leftMisses.length > 0
        ? Math.abs(
            leftMisses.reduce((a, s) => a + s.offline, 0) / leftMisses.length,
          )
        : 0,

    worstRightMiss:
      shots.length > 0 ? Math.max(...shots.map((s: any) => s.offline || 0)) : 0,

    worstLeftMiss:
      shots.length > 0
        ? Math.abs(Math.min(...shots.map((s: any) => s.offline || 0)))
        : 0,
  };

  const dataSignature = [
    shots.length,
    takeawayStats.rightMisses,
    takeawayStats.leftMisses,
    takeawayStats.severeRightMisses,
    takeawayStats.severeLeftMisses,
    takeawayStats.avgPath.toFixed(1),
    takeawayStats.avgFaceToTarget.toFixed(1),
  ].join("-");

  const { data: cached, error: cacheError } = await supabase
    .from("user_takeaways")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (cacheError) {
    console.error("Cache fetch failed:", cacheError);
  }

  const shouldUseCache =
    cached && cached.data_signature === dataSignature && cached.insight_json;

  if (shouldUseCache) {
    console.log("CACHE HIT");

    return {
      sessions,
      gettingStartedCompletions,
      profileInfo,
      activeLesson,
      userPoints,
      latestRound,
      rounds,
      takeaway: cached.insight_json,
    };
  }

  console.log("CACHE MISS - CALLING AI");

  const takeaway = await fetchAITakeaway(takeawayStats).catch((e) => {
    console.error("takeaway AI failed:", e);
    return null;
  });

  console.log("AI RESPONSE:", takeaway);

  if (takeaway) {
    const { data, error } = await supabase
      .from("user_takeaways")
      .upsert({
        user_id: userId,
        insight_json: takeaway,
        data_signature: dataSignature,
        shot_count: shots.length,
        updated_at: new Date().toISOString(),
      })
      .select();

    console.log("UPSERT RESULT:", data);

    if (error) {
      console.error("UPSERT ERROR:", error);
    }
  }

  return {
    sessions,
    gettingStartedCompletions,
    profileInfo,
    activeLesson,
    userPoints,
    latestRound,
    rounds,
    takeaway,
  };
};
