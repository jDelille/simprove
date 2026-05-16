"use client";

import styles from "./Dashboard.module.scss";
import {
  AveragesGraphWidget,
  LessonPlanWidget,
  MissTendencyWidget,
  SmallStatWidget,
} from "../widgets";
import { calculateProfileStats } from "@/lib/profile-stats/ProfileStats";
import { GettingStartedCompletions, Profile, Session } from "@/types";
import { GettingStartedWidget, SwingMetricsWidget } from "./widgets";
import { useDashboardData } from "@/hooks/useDashboardData";
import UserWidget from "./widgets/user-widget/UserWidget";
import { Round } from "@/types/round";
import StrokesGainedWidget from "../widgets/strokes-gained-widget/StrokesGainedWidget";
import PlayerArchetypeWidget from "../widgets/player-archetype-widget/PlayerArchetypeWidget";
import ScoringDistributionWidget from "../widgets/scoring-distribution-widget/ScoringDistributionWidget";
import { useEffect } from "react";
import { useTour } from "../tour-controller/TourContext";

type DashboardProps = {
  sessions: Session[];
  userId: string;
  gettingStartedCompletions?: GettingStartedCompletions[];
  activeLesson?: any;
  profile: Profile;
  userPoints: any;
  latestRound: any;
  rounds: Round[];
};

const Dashboard = (props: DashboardProps) => {
  const { isTourActive } = useTour();
  const shots = props.sessions.flatMap((session) => session.shots);

  const profileMetrics = calculateProfileStats({
    userId: props.userId,
    shots,
    sessionLength: props.sessions.length,
  });

  const dashboardData = useDashboardData({
    sessions: props.sessions,
    rounds: props.rounds,
    gettingStartedCompletions: props.gettingStartedCompletions,
    userId: props.userId,
    shots,
  });

  useEffect(() => {
    if (isTourActive) {
      document.body.classList.add("tour-active");
    } else {
      document.body.classList.remove("tour-active");

      // hard reset layout
      requestAnimationFrame(() => {
        window.scrollTo(window.scrollX, window.scrollY);
      });
    }
  }, [isTourActive]);

  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={`${styles.column} ${styles.leftColumn}`}>
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
            value={dashboardData.activitiesThisMonth}
            metric={" "} // sessions.length > 1 ? "sessions" : "session"
            trend={dashboardData.activityTrend.direction}
            trendText={dashboardData.activityTrendText}
            trendColor={dashboardData.activityTrendColor}
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
        <div className={styles.row}>
          <StrokesGainedWidget rounds={props.rounds} />
        </div>
        <div className={styles.row}>
          <PlayerArchetypeWidget rounds={props.rounds} />
          <ScoringDistributionWidget rounds={props.rounds} />
        </div>
      </div>

      {/* right side */}
      <div className={`${styles.column} ${styles.rightColumn}`}>
        <div className={styles.row}>
          <UserWidget
            profile={props.profile}
            latestRound={props.latestRound}
            userPoints={props.userPoints}
            activityCount={props.sessions.length + props.rounds.length}
          />
        </div>
        {!dashboardData.hasCompletedGettingStarted && (
          <div className={styles.row}>
            <GettingStartedWidget
              completions={props.gettingStartedCompletions}
            />
          </div>
        )}
        {dashboardData.hasCompletedGettingStarted && (
          <div className={styles.row}>
            <LessonPlanWidget
              userId={props.userId}
              activeLesson={props.activeLesson}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
