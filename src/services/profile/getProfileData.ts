/**
 * Gets the following data:
 * Profile info
 * user lessons,
 * user points,
 * rounds,
 * sessions
 * badges
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { fetchBadges } from "../badges/fetchBadges";
import { fetchSessions } from "../sessions/fetchSessions";
import { fetchRounds } from "../gspro/fetchRounds";
import { fetchUserLessons } from "../lessons/fetchUserLessons";
import { fetchUserPoints } from "../user-points/fetchUserPoints";
import { fetchProfileInfo } from "../profile-info/fetchProfileInfo";

type Props = {
  supabase: SupabaseClient;
  userId: string | undefined;
};

export const getProfileData = async ({ supabase, userId }: Props) => {
  if (!userId) {
    throw new Error("Missing userId");
  }

  const [badges, sessions, rounds, lessons, info, userPoints] = userId
    ? await Promise.all([
        fetchBadges(supabase),
        fetchSessions(userId, supabase),
        fetchRounds(userId, supabase),
        fetchUserLessons(userId, supabase),
        fetchProfileInfo(supabase),
        fetchUserPoints(userId, supabase),
      ])
    : [];

  return {
     badges: badges ?? [],
    sessions: sessions ?? [],
    rounds: rounds ?? [],
    lessons: lessons ?? [],
    info: info ?? null,
    userPoints: userPoints ?? [],
  };
};
