/**
 * Gets the following data:
 * Profile info
 * user lessons,
 * user points,
 * rounds,
 * sessions
 * achievements
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { fetchSessions } from "../sessions/fetchSessions";
import { fetchRounds } from "../gspro/fetchRounds";
import { fetchUserLessons } from "../lessons/fetchUserLessons";
import { fetchUserPoints } from "../user-points/fetchUserPoints";
import { fetchProfileInfo } from "../profile-info/fetchProfileInfo";
import { fetchAchievements } from "../achievments/fetchAchievements";
import { calculateAverages, calculateRoundStats } from "@/lib/shots/averages";

type Props = {
  supabase: SupabaseClient;
  userId: string | undefined;
};

export const getProfileData = async ({ supabase, userId }: Props) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  const [achievements, sessions, rounds, lessons, info, userPoints] = userId
    ? await Promise.all([
        fetchAchievements(supabase),
        fetchSessions(userId, supabase),
        fetchRounds(userId, supabase),
        fetchUserLessons(userId, supabase),
        fetchProfileInfo(supabase),
        fetchUserPoints(userId, supabase),
      ])
    : [];

  const shots = sessions?.flatMap((s) => s.shots) ?? [];
  const shotStats = calculateAverages(shots);
  const roundStats = calculateRoundStats(rounds ?? []);

  return {
    achievements: achievements ?? [],
    sessions: sessions ?? [],
    rounds: rounds ?? [],
    lessons: lessons ?? [],
    info: info ?? null,
    userPoints: userPoints ?? [],
     stats: {
    ...shotStats,
    ...roundStats,
    totalSessions: sessions?.length ?? 0,
  },
  };
};
