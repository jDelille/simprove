import EditProfile from "@/components/edit-profile/EditProfile";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";

const EditProfilePage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [profileInfo] = user?.id
    ? await Promise.all([fetchProfileInfo({supabaseClient: supabase})])
    : [null];

  const userProfile = profileInfo?.profile;

  return (
    <div className="page">
      <div className="page-content">
        <EditProfile profile={userProfile} />
      </div>
    </div>
  );
};

export default EditProfilePage;
