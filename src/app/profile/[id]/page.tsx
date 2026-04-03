import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchBadges } from "@/services/badges/fetchBadges";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";
import { fetchUserLessons } from "@/services/lessons/fetchUserLessons";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myClubs = user?.id ? await fetchGolfBag(user.id) : [];

  const [badges, sessions, lessons, profileInfo] = user?.id
    ? await Promise.all([
        fetchBadges(supabase),
        fetchSessions(user.id),
        fetchUserLessons(user.id, supabase),
        fetchProfileInfo(supabase),
      ])
    : [[], [], null];

  const userProfile = profileInfo?.profile;

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile
          userId={user?.id || ""}
          myClubs={myClubs}
          badges={badges}
          sessions={sessions}
          lessons={lessons as any}
          user={userProfile}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
