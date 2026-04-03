import Session from "@/components/session/Session";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchGettingStartedCompletions } from "@/services/getting-started-completions/fetchGettingStartedCompletions";
import { fetchSession } from "@/services/sessions/fetchSession";

const SessionPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [gettingStartedCompletions, session] = user?.id
    ? await Promise.all([
        fetchGettingStartedCompletions(user.id, supabase),
        fetchSession(id, supabase),
      ])
    : [[], []];

  const hasVititedSession = gettingStartedCompletions.some(
    (comp) => comp.step_id === 3,
  );

  if (!hasVititedSession) {
    await supabase.from("getting_started_completions").insert({
      user_id: user.id,
      step_id: 3,
    });
  }

  return (
    <div className="page">
      <div className="page-content">
        <Session session={session} />
      </div>
    </div>
  );
};

export default SessionPage;
