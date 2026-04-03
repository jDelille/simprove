import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchBadges } from "@/services/badges/fetchBadges";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myClubs = user?.id ? await fetchGolfBag(user.id, supabase) : [];

  const [badges] = user?.id
    ? await Promise.all([fetchBadges(supabase)])
    : [[]];

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile userId={user?.id || ""} myClubs={myClubs} badges={badges} />
      </div>
    </div>
  );
};

export default ProfilePage;
