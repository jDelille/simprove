import Dashboard from "@/components/dashboard/Dashboard";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const DashboardPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessions = user?.id ? await fetchSessions(user.id, supabase) : [];

  return (
    <div className="page">
      <div className="page-content">
        <Dashboard sessions={sessions} userId={user?.id || ""} />
      </div>
    </div>
  );
};

export default DashboardPage;
