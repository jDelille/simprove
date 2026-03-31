import ProfileHeader from "@/components/profile-header/ProfileHeader";
import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myClubs = user?.id ? await fetchGolfBag(user.id, supabase) : [];

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile userId={user?.id || ""} myClubs={myClubs} />
      </div>
    </div>
  );
};

export default ProfilePage;
