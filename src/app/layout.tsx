import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/navbar/Navbar";
import { Providers } from "./providers";
import Footer from "@/components/footer/Footer";
import { createSupabaseServer } from "@/lib/supabase/server";
import { fetchProfileInfo } from "@/services/profile-info/fetchProfileInfo";
import ClientTourWrapper from "@/components/tour-controller/ClientTourWrapper";
import "@/styles/globals.scss";
import { fetchNotifications } from "@/services/notifications/fetchNotifications";

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
  const { profile } = await fetchProfileInfo(supabase);
  const notifications = await fetchNotifications(profile.id, supabase);

  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ThemeProvider>
          <Navbar profile={profile} notifications={notifications}/>
          <Providers>
            <ClientTourWrapper profile={profile}>{children}</ClientTourWrapper>
          </Providers>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
