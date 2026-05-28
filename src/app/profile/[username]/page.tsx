import Profile from "@/components/profile/Profile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchGolfBag } from "@/services/golf-bag/fetchGolfBag";
import { fetchUserLeaderboardPosition } from "@/services/leaderboard/fetchLeaderboardPosition";
import { getProfileData } from "@/services/profile/getProfileData";

type ProfilePageProps = {
  params: Promise<{
    username: string;
  }>;
};

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id")
    .eq("username", decodedUsername)
    .single();

  if (!profile) {
    return <h1>404</h1>;
  }

  const profileId = profile.id;

  const [myClubs, leaderboardPosition, profileData] = await Promise.all([
    fetchGolfBag(profileId, supabase),
    fetchUserLeaderboardPosition(profileId, supabase),
    getProfileData({
      supabase,
      userId: profileId,
      viewerId: user.id,
    }),
  ]);

  if (!profileData) {
    return <h1>404</h1>;
  }

  return (
    <div className="page">
      <div className="profile-page-content">
        <Profile
          userId={profileId || ""}
          myClubs={myClubs}
          sessions={profileData.sessions}
          lessons={profileData.lessons}
          user={profileData.info?.profile}
          userPoints={profileData.userPoints}
          rounds={profileData.rounds}
          stats={profileData.stats}
          social={profileData.social}
          currentUserId={user.id}
          leaderboardPosition={leaderboardPosition}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
