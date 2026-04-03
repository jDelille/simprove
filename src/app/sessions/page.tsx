import Sessions from "@/components/sessions/Sessions";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const SessionsPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [sessions] = user?.id
    ? await Promise.all([
        fetchSessions(user.id),
      ])
    : [[], []];

  // check if user has ever visted the sessions page before, if not, edit getting started completion


  return (
    <div className="page">
      <div className="page-content">
        <Sessions sessions={sessions} />
      </div>
    </div>
  );
};

export default SessionsPage;
