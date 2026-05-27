import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { Providers } from "./providers";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import { fetchNotifications } from "@/services/notifications/fetchNotifications";
import { getActivitiesData } from "@/services/activities/getActivitiesData";
import ClientTourWrapper from "@/components/tour-controller/ClientTourWrapper";
import AppShell from "./(shell)/AppShell";
import "@/styles/globals.scss";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simprove",
  description: "Your personal golf performance tracker.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createSupabaseServer();

  const { profile } = await fetchProfileInfo({ supabaseClient: supabase });
  const userId = profile?.id;

  let sessions: any[] = [];
  let rounds: any[] = [];

  if (userId) {
    const data = await getActivitiesData({ supabase, userId });
    sessions = data.sessions;
    rounds = data.rounds;
  }

  const hasActivities = sessions.length > 0 || rounds.length > 0;

  let notifications: any[] = [];

  if (profile?.id) {
    notifications = await fetchNotifications(profile.id, supabase);
  }

  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ThemeProvider>
          <Providers>
            <ClientTourWrapper profile={profile}>
              <AppShell>{children}</AppShell>
            </ClientTourWrapper>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
