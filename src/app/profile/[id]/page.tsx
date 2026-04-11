import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchBadges } from "@/services/badges/fetchBadges";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";
import { fetchUserLessons } from "@/services/lessons/fetchUserLessons";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { fetchSessions } from "@/services/sessions/fetchSessions";
import { fetchUserPoints } from "@/services/user-points/fetchUserPoints";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myClubs = user?.id ? await fetchGolfBag(user.id, supabase) : [];

  const [badges, sessions, lessons, profileInfo, userPoints] = user?.id
    ? await Promise.all([
        fetchBadges(supabase),
        fetchSessions(user.id, supabase),
        fetchUserLessons(user.id, supabase),
        fetchProfileInfo(supabase),
                fetchUserPoints(user.id, supabase),
        
      ])
    : [[], [], null];

  const userProfile = profileInfo?.profile;

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile
          userId={user?.id || ""}
          myClubs={myClubs}
          sessions={sessions}
          lessons={lessons as any}
          user={userProfile}
          userPoints={userPoints}

          // badges={badges}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
