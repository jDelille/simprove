import Sessions from "@/components/sessions/Sessions";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const SessionsPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [sessions, profileInfo] = user?.id
    ? await Promise.all([
        fetchSessions(user.id, supabase),
        fetchProfileInfo(supabase),
      ])
    : [[], null];

  const profile = profileInfo?.profile;

  if (!profile) {
    return null;
  }

  return (
    <div className="page">
      <div className="page-content">
        <Sessions sessions={sessions} profile={profile} />
      </div>
    </div>
  );
};

export default SessionsPage;
