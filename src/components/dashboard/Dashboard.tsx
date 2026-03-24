"use client";

import styles from "./Dashboard.module.scss";
import {
  AveragesGraphWidget,
  LessonPlanWidget,
  MissTendencyWidget,
  RecentActivityWidget,
  SmallStatWidget,
} from "../widgets";
import { calculateProfileStats } from "@/lib/profile-stats/ProfileStats";
import { calculateTrend, formatTrend, groupByMonth } from "@/lib/stats/trends";
import { getWeakestClubs } from "@/lib/stats/weakestClubs";
import SwingMetricsWidget from "../widgets/swing-metrics-widget/SwingMetricsWidget";

type DashboardProps = {
  sessions: any[];
  userId: string;
};

const Dashboard = ({ sessions, userId }: DashboardProps) => {
  const shots = sessions.flatMap((session) => session.shots);

  const profileMetrics = calculateProfileStats({
    userId: userId,
    shots,
    sessionLength: sessions.length,
  });

  const groupedSessions = groupByMonth(sessions);
  const groupedShots = groupByMonth(shots);

  const currentMonthKey = new Date().toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
  const lastMonthKey = new Date(
    new Date().setMonth(new Date().getMonth() - 1),
  ).toLocaleString("default", { month: "short", year: "numeric" });

  const sessionsThisMonth =
    groupedSessions[currentMonthKey]?.sessions.length || 0;
  const sessionsLastMonth = groupedSessions[lastMonthKey]?.sessions.length || 0;

  const sessionsTrend = calculateTrend(sessionsThisMonth, sessionsLastMonth);
  const { text: sessionsTrendText, color: sessionsTrendColor } =
    formatTrend(sessionsTrend);

  const shotsThisMonth = groupedShots[currentMonthKey]?.sessions.length || 0;
  const shotsLastMonth = groupedShots[lastMonthKey]?.sessions.length || 0;

  const shotsTrend = calculateTrend(shotsThisMonth, shotsLastMonth);
  const { text: shotsTrendText, color: shotsTrendColor } =
    formatTrend(shotsTrend);

  const longestThisMonth = Math.max(
    ...(groupedShots[currentMonthKey]?.sessions.map(
      (s: any) => s.carry ?? 0,
    ) || [0]),
  );
  const longestLastMonth = Math.max(
    ...(groupedShots[lastMonthKey]?.sessions.map((s: any) => s.carry ?? 0) || [
      0,
    ]),
  );

  const carryTrend = calculateTrend(longestThisMonth, longestLastMonth);
  const { text: carryTrendText, color: carryTrendColor } =
    formatTrend(carryTrend);

  const weakestClubs = getWeakestClubs(shots);

  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row}>
          <SmallStatWidget
            title="Total Shots Tracked"
            value={profileMetrics.count}
            metric="shots"
            trend={shotsTrend.direction}
            trendText={shotsTrendText}
            trendColor={shotsTrendColor}
            isEmpty={sessions.length === 0}
          />

          <SmallStatWidget
            title="Sessions This Month"
            value={sessionsThisMonth}
            metric="sessions"
            trend={sessionsTrend.direction}
            trendText={sessionsTrendText}
            trendColor={sessionsTrendColor}
            isEmpty={sessions.length === 0}
          />

          <SmallStatWidget
            title="Longest Carry"
            value={Number(profileMetrics.longestCarry?.toFixed(1)) || 0}
            metric="yards"
            trend={carryTrend.direction}
            trendText={carryTrendText}
            trendColor={carryTrendColor}
            isEmpty={sessions.length === 0}
          />

          <SmallStatWidget
            title="Most Practiced Club"
            value={profileMetrics.mostUsedClub || "N/A"}
            metric=""
            trend={null}
            trendText={`${profileMetrics.mostUsedClubCount || 0} total shots`}
            isEmpty={sessions.length === 0}
          />
        </div>

        <div className={styles.row}>
          <AveragesGraphWidget userId={userId} />
        </div>

        <div className={styles.row}>
          <SwingMetricsWidget shots={shots} />
          <MissTendencyWidget shots={shots} />
        </div>
      </div>

      {/* right side */}
      <div className={styles.column}>
        <div className={styles.row}>
          <RecentActivityWidget userId={userId} />
        </div>

        <div className={styles.row}>
          <LessonPlanWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
