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

  const sessions = await fetchSessions(user.id, supabase);
  const profileData = await fetchProfileInfo(supabase);

  const profileInfo = profileData?.profile;

  if (!profileInfo) {
    return null;
  }

  return (
    <div className="page">
      <div className="page-content">
        <Sessions sessions={sessions} profileInfo={profileInfo} />
      </div>
    </div>
  );
};

export default SessionsPage;