"use client";

import { useUser } from "@/hooks/useUser";
import styles from "./Dashboard.module.scss";
import {
  AveragesGraphWidget,
  LessonPlanWidget,
  MissTendencyWidget,
  RecentActivityWidget,
  SmallStatWidget,
  WeakestConsistencyWidget,
} from "../widgets";
import { calculateProfileStats } from "@/lib/profile-stats/ProfileStats";
import { useSessions } from "@/hooks/useSessions";
import { profile } from "console";

const Dashboard = () => {
  const { user } = useUser();
  const { data: sessions = [], isLoading } = useSessions(user?.id || "");

  const profileMetrics = calculateProfileStats({
    userId: user?.id,
    shots: sessions.flatMap((session) => session.shots),
    sessionLength: sessions.length,
    // club: selectedClub,
  });

  console.log(profileMetrics)

  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row}>
          <SmallStatWidget
            title="Total Shots Tracked"
            value={profileMetrics.count}
            metric="shots"
            trend="up"
            trendText="15% increase from last month"
          />
          <SmallStatWidget
            title="Sessions This Month"
            value={profileMetrics.sessionLength}
            metric="sessions"
            trend="up"
            trendText="15% increase from last month"
          />
          <SmallStatWidget
            title="Longest Carry"
            value={Number(profileMetrics.longestCarry?.toFixed(1)) || 0}
            metric="yards"
            trend="up"
            trendText="15% increase from last month"
          />
          <SmallStatWidget
            title="Most Practiced Club"
            value={profileMetrics.mostUsedClub || "N/A"}
            metric=""
            trend="up"
            trendText={`${profileMetrics.mostUsedClubCount || 0} total shots`}
          />
        </div>
        <div className={styles.row}>
          <AveragesGraphWidget />
        </div>
        <div className={styles.row}>
          {/* Widget: Weakest consistency */}
          <WeakestConsistencyWidget />
          {/* Widget: Miss tendency */}
          <MissTendencyWidget />
        </div>
      </div>
      {/* right side */}
      <div className={styles.column}>
        <div className={styles.row}>
          <RecentActivityWidget userId={user?.id} />
        </div>
        <div className={styles.row}>
          <LessonPlanWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
