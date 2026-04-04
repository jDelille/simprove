import Dashboard from "@/components/dashboard/Dashboard";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchRecentActivity } from "@/services/activity/fetchRecentActivity";
import { fetchGettingStartedCompletions } from "@/services/getting-started-completions/fetchGettingStartedCompletions";
import { fetchActiveLesson } from "@/services/lessons/fetchActiveLesson";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const DashboardPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [
    sessions,
    gettingStartedCompletions,
    profileInfo,
    activeLesson,
    recentActivity,
  ] = user?.id
    ? await Promise.all([
        fetchSessions(user.id, supabase),
        fetchGettingStartedCompletions(user.id, supabase),
        fetchProfileInfo(supabase),
        fetchActiveLesson(user.id, supabase),
        fetchRecentActivity(user.id, supabase),
      ])
    : [[], [], null];

  // check if user has completed profile setup
  const userProfile = profileInfo?.profile;
  const hasCompletedProfile =
    userProfile?.display_name &&
    userProfile?.avatar_path &&
    userProfile?.location &&
    userProfile?.username &&
    userProfile?.launch_monitor &&
    userProfile?.bio;

  if (hasCompletedProfile) {
    // check if completion with step_id 1 exists, if not, create it
    const hasCompletedStep1 = gettingStartedCompletions.some(
      (comp) => comp.step_id === 1,
    );

    if (!hasCompletedStep1) {
      await supabase.from("getting_started_completions").insert({
        user_id: user.id,
        step_id: 1,
      });
    }
  }

  return (
    <div className="page">
      <div className="page-content">
        <Dashboard
          sessions={sessions}
          userId={user?.id || ""}
          gettingStartedCompletions={gettingStartedCompletions}
          activeLesson={activeLesson}
          recentActivity={recentActivity || []}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
