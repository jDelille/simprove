import Dashboard from "@/components/dashboard/Dashboard";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getDashboardData } from "@/services/dashboard/getDashboardData";

const DashboardPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const dashboardData = await getDashboardData({
    supabase: supabase,
    userId: user.id,
  });

  const {
    profileInfo,
    gettingStartedCompletions,
    sessions,
    activeLesson,
    userPoints,
    latestRound,
    rounds,
    takeaway
  } = dashboardData;

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
          profile={userProfile}
          userPoints={userPoints}
          latestRound={latestRound}
          rounds={rounds}
          takeaway={takeaway}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
