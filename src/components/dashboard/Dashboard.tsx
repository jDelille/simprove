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
import GettingStartedWidget from "../widgets/getting-started-widget/GettingStartedWidget";
import { Session } from "@/types/session";
import { GettingStartedCompletions } from "@/types/gettingStartedCompletions";
import { ActiveLesson } from "@/types/activeLesson";
import { RecentActivity } from "@/types/recentActivity";
import { Shot } from "@/types/shot";

type DashboardProps = {
  sessions: Session[];
  userId: string;
  gettingStartedCompletions?: GettingStartedCompletions[];
  activeLesson?: any;
  recentActivity?: RecentActivity[];
};

const Dashboard = ({
  sessions,
  userId,
  gettingStartedCompletions,
  activeLesson,
  recentActivity,
}: DashboardProps) => {
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
      (s: Shot) => s.carry ?? 0,
    ) || [0]),
  );
  const longestLastMonth = Math.max(
    ...(groupedShots[lastMonthKey]?.sessions.map((s: Shot) => s.carry ?? 0) || [
      0,
    ]),
  );

  const carryTrend = calculateTrend(longestThisMonth, longestLastMonth);
  const { text: carryTrendText, color: carryTrendColor } =
    formatTrend(carryTrend);

  const weakestClubs = getWeakestClubs(shots);

  const hasCompletedGettingStarted = gettingStartedCompletions
    ? gettingStartedCompletions.length === 4
    : false;

  return (
    <div className={styles.dashboard} >
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row + " " + styles.statsRow} id="stats-row">
          <SmallStatWidget
            title="Total Shots"
            value={profileMetrics.count}
            metric="shots"
            trend={shotsTrend.direction}
            trendText={shotsTrendText}
            trendColor={shotsTrendColor}
            isEmpty={sessions.length === 0}
          />

          <SmallStatWidget
            title="Sessions"
            value={sessionsThisMonth}
            metric={" "} // sessions.length > 1 ? "sessions" : "session"
            trend={sessionsTrend.direction}
            trendText={sessionsTrendText}
            trendColor={sessionsTrendColor}
            isEmpty={sessions.length === 0}
          />

          <SmallStatWidget
            title="Longest Carry"
            value={Number(profileMetrics.longestCarry?.toFixed(1)) || 0}
            metric="yds"
            trend={carryTrend.direction}
            trendText={carryTrendText}
            trendColor={carryTrendColor}
            isEmpty={sessions.length === 0}
          />

          <SmallStatWidget
            title="Most Used Club"
            value={profileMetrics.mostUsedClub || "N/A"}
            metric=""
            trend={null}
            trendText={`${profileMetrics.mostUsedClubCount || 0} total shots`}
            isEmpty={sessions.length === 0}
          />
        </div>

        <div className={styles.row}>
          <AveragesGraphWidget userId={userId} sessions={sessions} />
        </div>

        <div className={styles.row}>
          <SwingMetricsWidget shots={shots} />
          <MissTendencyWidget shots={shots} />
        </div>
      </div>

      {/* right side */}
      <div className={styles.column}>
        <div className={styles.row}>
          <RecentActivityWidget userId={userId} recentActivity={recentActivity} />
        </div>
        {!hasCompletedGettingStarted && (
          <div className={styles.row}>
            <GettingStartedWidget completions={gettingStartedCompletions} />
          </div>
        )}

        <div className={styles.row}>
          <LessonPlanWidget userId={userId} activeLesson={activeLesson} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
