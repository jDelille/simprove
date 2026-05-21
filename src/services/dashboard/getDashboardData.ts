import { SupabaseClient } from "@supabase/supabase-js"
import { fetchSessions } from "../sessions/fetchSessions";
import { fetchGettingStartedCompletions } from "../getting-started-completions/fetchGettingStartedCompletions";
import { fetchProfileInfo } from "../profile-info/fetchProfileInfo";
import { fetchActiveLesson } from "../lessons/fetchActiveLesson";
import { fetchUserPoints } from "../user-points/fetchUserPoints";
import { fetchLatestRound } from "../gspro/fetchLatestRound";
import { fetchRounds } from "../gspro/fetchRounds";

type Props = {
    supabase: SupabaseClient;
    userId: string
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
    fetchSessions(userId, supabase).catch((e) => { console.error('fetchSessions failed:', e); return []; }),
    fetchGettingStartedCompletions(userId, supabase).catch((e) => { console.error('fetchGettingStartedCompletions failed:', e); return []; }),
    fetchProfileInfo({supabaseClient: supabase}).catch((e) => { console.error('fetchProfileInfo failed:', e); return null; }),
    fetchActiveLesson(userId, supabase).catch((e) => { console.error('fetchActiveLesson failed:', e); return null; }),
    fetchUserPoints(userId, supabase).catch((e) => { console.error('fetchUserPoints failed:', e); return null; }),
    fetchLatestRound(userId, supabase).catch((e) => { console.error('fetchLatestRound failed:', e); return null; }),
    fetchRounds(userId, supabase).catch((e) => { console.error('fetchRounds failed:', e); return []; }),
  ]);

  return { sessions, gettingStartedCompletions, profileInfo, activeLesson, userPoints, latestRound, rounds };
};