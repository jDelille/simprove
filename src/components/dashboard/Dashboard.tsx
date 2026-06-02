"use client";

import styles from "./Dashboard.module.scss";
import {
  AveragesGraphWidget,
  MissionWidget,
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
import Takeaway from "./takeaway/Takeaway";
import { getDashboardWidgets } from "@/services/dashboard/getDashboardWidgets";

type DashboardProps = {
  sessions: Session[];
  userId: string;
  gettingStartedCompletions?: GettingStartedCompletions[];
  activeLesson?: any;
  profile: Profile;
  userPoints: any;
  latestRound: any;
  rounds: Round[];
  takeaway: any;
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

  const dashboardWidgetsData = getDashboardWidgets(
    props.takeaway,
    profileMetrics,
    shots,
    props.sessions
  );

  console.log(dashboardWidgetsData)

  useEffect(() => {
    if (isTourActive) {
      document.body.classList.add("tour-active");
    } else {
      document.body.classList.remove("tour-active");

      requestAnimationFrame(() => {
        window.scrollTo(window.scrollX, window.scrollY);
      });
    }
  }, [isTourActive]);

  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={`${styles.column} ${styles.leftColumn}`}>
        {props.sessions.length > 0 && (
          <div className={styles.row}>
          <Takeaway takeaway={props.takeaway} />
        </div>
        )}
        <div className={styles.row + " " + styles.statsRow} id="stats-row">
          <SmallStatWidget
            title="Primary Miss"
            value={profileMetrics.primaryMiss.label}
            trendText={dashboardWidgetsData.primaryMiss.value.avgMiss.toFixed(1) + " yds offline"}
            isEmpty={shots.length === 0}
          />
          <SmallStatWidget
            title="Miss Cause"
            value={dashboardWidgetsData.missCause.value}
            trendText={dashboardWidgetsData.missCause.trendText}
            isEmpty={shots.length === 0}
          />
          <SmallStatWidget
            title="Swing Trend"
            value={dashboardWidgetsData.swingTrend.value}
            trendText={dashboardWidgetsData.swingTrend.trendText}
            isEmpty={shots.length === 0}
          />
          <SmallStatWidget
            title="Focus Area"
            value={dashboardWidgetsData.focusArea.value}
            trendText={dashboardWidgetsData.focusArea.trendText}
            isEmpty={shots.length === 0}
            link="/missions"
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
            <MissionWidget
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
