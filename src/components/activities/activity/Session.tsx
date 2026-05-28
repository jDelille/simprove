"use client";

import moment from "moment";
import styles from "./Activity.module.scss";
import { useState } from "react";
import { useSession } from "@/hooks/useSession";
import { SmallStatWidget } from "@/components/widgets";
import SessionShotsGraphWidget from "@/components/widgets/session-shots-graph-widget/SessionShotsGraphWidget";
import ClubBreakdownWidget from "@/components/widgets/club-breakdown-widget/ClubBreakdownWidget";
import BagMapWidget from "@/components/widgets/bag-map-widget/BagMapWidget";
import SessionScoreWidget from "@/components/widgets/session-score-widget/SessionScoreWidget";

type SessionProps = {
  activityData: any;
};

const Session = ({ activityData }: SessionProps) => {
  const [selectedClub, setSelectedClub] = useState<string>("ALL");

  const { session_name, session_date, shots } = activityData;

  const activity = useSession({ activity: activityData, selectedClub });

  const { sessionMetrics } = activity;

  return (
    <>
      <div className={styles.title}>
        <h1>{session_name}</h1>
        <div className={styles.info}>
          <p>
            {moment(session_date).format("MMMM DD YYYY")} · {shots.length} shots
            · Range Session
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.row + " " + styles.statsRow}>
            <SmallStatWidget
              title="Total Shots"
              value={sessionMetrics.count?.toFixed(0) || 0}
              metric="shots"
              trend="increase"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Best Carry"
              value={sessionMetrics.longestCarry?.toFixed(1) || 0}
              metric="yds"
              trend="increase"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Avg Offline"
              value={sessionMetrics.avgOffline?.toFixed(1) || 0}
              metric="yds"
              trend="increase"
              trendText="Personal Best"
            />
            <SmallStatWidget
              title="Peak Ball Speed"
              value={sessionMetrics.peakBallSpeed?.toFixed(1) || 0}
              metric="mph"
              trend="increase"
              trendText="Personal Best"
            />
          </div>
          <div className={styles.row}>
            <SessionShotsGraphWidget session={activityData} />
          </div>
          {/* <div className={styles.row}>
            Carry consistency
          </div> */}
          <div className={styles.row}>
            <ClubBreakdownWidget data={activity.tableData} />
          </div>
          <div className={styles.row}>{/* Session analysis */}</div>
        </div>
        <div className={styles.column}>
          {/* Session score */}
          <div className={styles.row}>
            <SessionScoreWidget shots={activityData.shots} />
          </div>
          {/* shot shape */}

          {/* <div className={styles.row}>
            <BagMapWidget shots={activityData.shots} />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Session;
