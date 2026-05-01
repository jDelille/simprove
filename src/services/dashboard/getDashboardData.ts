import { SupabaseClient } from "@supabase/supabase-js"
import { fetchSessions } from "../sessions/fetchSessions";
import { fetchGettingStartedCompletions } from "../getting-started-completions/fetchGettingStartedCompletions";
import { fetchProfileInfo } from "../profile-info/fetchProfileInfo";
import { fetchActiveLesson } from "../lessons/fetchActiveLesson";
import { fetchRecentActivity } from "../activity/fetchRecentActivity";
import { fetchUserPoints } from "../user-points/fetchUserPoints";
import { fetchLatestRound } from "../gspro/fetchLatestRound";
import { fetchRounds } from "../gspro/fetchRounds";

type Props = {
    supabase: SupabaseClient;
    userId: string
};


export const getDashboardData = async ({supabase, userId}: Props) => {

    const sessions = await fetchSessions(userId, supabase);
    const gettingStartedCompletions = await fetchGettingStartedCompletions(userId, supabase);
    const profileInfo = await fetchProfileInfo(supabase);
    const activeLesson = await fetchActiveLesson(userId, supabase);
    const recentActivity = await fetchRecentActivity(userId, supabase);
    const userPoints = await fetchUserPoints(userId, supabase);
    const latestRound = await fetchLatestRound(userId, supabase);
    const rounds = await fetchRounds(userId, supabase);

    return {
        sessions,
        gettingStartedCompletions,
        profileInfo,
        activeLesson,
        recentActivity,
        userPoints,
        latestRound,
        rounds
    };
}