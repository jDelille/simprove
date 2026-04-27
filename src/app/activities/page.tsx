import Activities from "@/components/activities/Activities";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getActivitiesData } from "@/services/activities/getActivitiesData";

const ActivitiesPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const activitiesData = await getActivitiesData({
    supabase: supabase,
    userId: user.id,
  });

  return (
    <div className="page">
      <div className="page-content">
        <Activities
          sessions={activitiesData.sessions}
          rounds={activitiesData.rounds}
          profile={activitiesData.profileInfo.profile}
        />
      </div>
    </div>
  );
};

export default ActivitiesPage;
