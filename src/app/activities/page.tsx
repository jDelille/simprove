import Activities from "@/components/activities/Activities";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchRounds } from "@/services/gspro/fetchRounds";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const ActivitiesPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [sessions, rounds, profileInfo] = await Promise.all([
    fetchSessions(user.id, supabase),
    fetchRounds(user.id, supabase),
    fetchProfileInfo(supabase),
  ]);

  const profile = profileInfo?.profile;

  return (
    <div className="page">
      <div className="page-content">
        <Activities sessions={sessions} rounds={rounds} profile={profile} />
      </div>
    </div>
  );
};

export default ActivitiesPage;
