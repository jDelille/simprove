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
    : [[], []];

  // check if user has ever visted the sessions page before, if not, edit getting started completion


  return (
    <div className="page">
      <div className="page-content">
        <Sessions sessions={sessions} profileInfo={profileInfo} />
      </div>
    </div>
  );
};

export default SessionsPage;
