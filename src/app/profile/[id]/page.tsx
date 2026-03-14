import ProfileHeader from "@/components/profile-header/ProfileHeader";
import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page">
      <div className="page-content">
        <ProfileHeader userId={user?.id || ""} />
        <Profile userId={user?.id || ""} />
      </div>
    </div>
  );
};

export default ProfilePage;
