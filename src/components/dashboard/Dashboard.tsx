"use client";

import styles from "./Dashboard.module.scss";
import {
  AveragesGraphWidget,
  LessonPlanWidget,
  MissTendencyWidget,
  SmallStatWidget,
} from "../widgets";
import { calculateProfileStats } from "@/lib/profile-stats/ProfileStats";
import {
  GettingStartedCompletions,
  Profile,
  RecentActivity,
  Session,
} from "@/types";
import {
  GettingStartedWidget,
  SwingMetricsWidget,
} from "./widgets";
import { useDashboardData } from "@/hooks/useDashboardData";
import UserWidget from "./widgets/user-widget/UserWidget";

type DashboardProps = {
  sessions: Session[];
  userId: string;
  gettingStartedCompletions?: GettingStartedCompletions[];
  activeLesson?: any;
  recentActivity?: RecentActivity[];
  profile: Profile;
  userPoints: any;
  latestRound: any;
};

const Dashboard = (props: DashboardProps) => {
  const shots = props.sessions.flatMap((session) => session.shots);

  const profileMetrics = calculateProfileStats({
    userId: props.userId,
    shots,
    sessionLength: props.sessions.length,
  });

  const dashboardData = useDashboardData({
    sessions: props.sessions,
    gettingStartedCompletions: props.gettingStartedCompletions,
    userId: props.userId,
    shots,
  });

  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row + " " + styles.statsRow} id="stats-row">
          <SmallStatWidget
            title="Total Shots"
            value={profileMetrics.count}
            metric="shots"
            trend={dashboardData.shotsTrend.direction}
            trendText={dashboardData.shotsTrendText}
            trendColor={dashboardData.shotsTrendColor}
            isEmpty={shots.length === 0}
          />

          <SmallStatWidget
            title="Activities"
            value={dashboardData.sessionsThisMonth}
            metric={" "} // sessions.length > 1 ? "sessions" : "session"
            trend={dashboardData.sessionsTrend.direction}
            trendText={dashboardData.sessionsTrendText}
            trendColor={dashboardData.sessionsTrendColor}
            isEmpty={shots.length === 0}
          />

          <SmallStatWidget
            title="Longest Carry"
            value={Number(profileMetrics.longestCarry?.toFixed(1)) || 0}
            metric="yds"
            trend={dashboardData.carryTrend.direction}
            trendText={dashboardData.carryTrendText}
            trendColor={dashboardData.carryTrendColor}
            isEmpty={shots.length === 0}
          />

          <SmallStatWidget
            title="Most Used Club"
            value={profileMetrics.mostUsedClub || "N/A"}
            metric=""
            trend={null}
            trendText={`${profileMetrics.mostUsedClubCount || 0} total shots with this club`}
            isEmpty={shots.length === 0}
          />
        </div>

        <div className={styles.row}>
          <AveragesGraphWidget sessions={props.sessions} />
        </div>

        <div className={styles.row}>
          <SwingMetricsWidget shots={shots} />
          <MissTendencyWidget shots={shots} />
        </div>
      </div>

      {/* right side */}
      <div className={styles.column}>
        {!dashboardData.hasCompletedGettingStarted && (
          <div className={styles.row}>
            <GettingStartedWidget
              completions={props.gettingStartedCompletions}
            />
          </div>
        )}

        <div className={styles.row}>
          <UserWidget
            profile={props.profile}
            latestRound={props.latestRound}
            userPoints={props.userPoints}
          />
        </div>

        <div className={styles.row}>
          <LessonPlanWidget
            userId={props.userId}
            activeLesson={props.activeLesson}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
