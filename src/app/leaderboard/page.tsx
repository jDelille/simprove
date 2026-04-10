import Leaderboard from "@/components/leaderboard/Leaderboard";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchLeaderboard } from "@/services/leaderboard/fetchLeaderboard";

const LeaderboardPage = async () => {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const [leaderboardData] = user?.id
    ? await Promise.all([
        fetchLeaderboard(supabase),
    ])
    : [];

    return (
        <div className="page">
            <div className="page-content">
                <Leaderboard leaderboardData={leaderboardData} />
            </div>
        </div>
    )

};

export default LeaderboardPage;
