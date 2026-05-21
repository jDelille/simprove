import { SupabaseClient } from "@supabase/supabase-js";
import { fetchSessions } from "../sessions/fetchSessions";
import { fetchRounds } from "../gspro/fetchRounds";
import { fetchProfileInfo } from "../profile-info/fetchProfileInfo";

type Props = {
    supabase: SupabaseClient;
    userId: string;
}

export const getActivitiesData = async ({supabase, userId}: Props) => {

    const sessions = await fetchSessions(userId, supabase);
    const rounds = await fetchRounds(userId, supabase);
    const profileInfo = await fetchProfileInfo({supabaseClient: supabase});

    return {
        sessions,
        rounds,
        profileInfo
    };
}