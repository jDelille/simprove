import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchBadges } from "@/services/badges/fetchBadges";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";
import { fetchSessions } from "@/services/sessions/fetchSessions";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myClubs = user?.id ? await fetchGolfBag(user.id, supabase) : [];

  const [badges, sessions] = user?.id
    ? await Promise.all([
        fetchBadges(supabase),
        fetchSessions(user.id, supabase),
      ])
    : [[], [], null];

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile
          userId={user?.id || ""}
          myClubs={myClubs}
          badges={badges}
          sessions={sessions}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
