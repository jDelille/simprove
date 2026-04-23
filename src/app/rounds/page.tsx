import Rounds from "@/components/rounds/Rounds";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchRounds } from "@/services/gspro/fetchRounds";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";

const RoundsPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [profileInfo, rounds] = user?.id
    ? await Promise.all([
        fetchProfileInfo(supabase),
        fetchRounds(user.id, supabase)
    ])
    : [null];

  const profile = profileInfo?.profile;

  if (!profile) {
    return null;
  }
  return (
    <div className="page">
        <div className="page-content">
            <Rounds rounds={rounds}/>
        </div>
    </div>
  )
};

export default RoundsPage;
