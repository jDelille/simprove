import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnnouncementBar from "@/components/announcement-bar/AnnouncementBar";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { getActivitiesData } from "@/services/activities/getActivitiesData";
import { fetchNotifications } from "@/services/notifications/fetchNotifications";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();

  const { profile } = await fetchProfileInfo({ supabaseClient: supabase });

  const userId = profile?.id;

  let sessions = [];
  let rounds = [];

  if (userId) {
    const data = await getActivitiesData({ supabase, userId });
    sessions = data.sessions;
    rounds = data.rounds;
  }

  const hasActivities = sessions.length > 0 || rounds.length > 0;

  const notifications = userId
    ? await fetchNotifications(userId, supabase)
    : [];

  return (
    <>
      <Navbar profile={profile} notifications={notifications} />

      <AnnouncementBar
        hasActivities={hasActivities}
        isDemoAccount={profile?.is_demo_account}
      />

      {children}

      <Footer />
    </>
  );
}
