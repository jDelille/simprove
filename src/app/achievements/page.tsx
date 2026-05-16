import Achievements from "@/components/achievments/Achievements";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchAchievements } from "@/services/achievments/fetchAchievements";
import { fetchUserAchievements } from "@/services/achievments/fetchUserAchievements";
import { fetchAllAchievementGlobalPercentages } from "@/services/achievments/getAchievmentStats";

const AchievementsPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [achievements, userAchievements, globalPercentage] = await Promise.all([
    fetchAchievements(supabase),
    fetchUserAchievements(user.id),
    fetchAllAchievementGlobalPercentages()
  ]);

  return (
    <div className="page">
      <div className="page-content">
        <Achievements
          achievements={achievements}
          userAchievements={userAchievements}
          globalPercentage={globalPercentage}
        />
      </div>
    </div>
  );
};

export default AchievementsPage;
