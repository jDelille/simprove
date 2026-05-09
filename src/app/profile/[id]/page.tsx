import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";
import { getProfileData } from "@/services/profile/getProfileData";

const ProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myClubs = user?.id ? await fetchGolfBag(user.id, supabase) : [];

  const profileData = await getProfileData({
    supabase: supabase,
    userId: user?.id,
  });

  if (!profileData) {
    return <h1>404</h1>;
  }

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile
          userId={user?.id || ""}
          myClubs={myClubs}
          sessions={profileData.sessions}
          lessons={profileData.lessons}
          user={profileData.info?.profile}
          userPoints={profileData.userPoints}
          rounds={profileData.rounds}
          stats={profileData.stats}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
