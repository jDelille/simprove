"use client";

import { useUser } from "@/hooks/useUser";
import styles from "./Dashboard.module.scss";
import {
  LessonPlanWidget,
  RecentActivityWidget,
  SmallStatWidget,
} from "../widgets";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row}>
          <SmallStatWidget
            title="Total Shots Tracked"
            value={1234}
            metric="shots"
            trend="up"
            trendText="15% increase from last month"
          />
          <SmallStatWidget
            title="Sessions This Month"
            value={12}
            metric="sessions"
            trend="up"
            trendText="15% increase from last month"
          />
          <SmallStatWidget
            title="Longest Carry"
            value={1234}
            metric="yards"
            trend="up"
            trendText="15% increase from last month"
          />
          <SmallStatWidget
            title="Most Practiced Club"
            value={"7I"}
            metric="shots"
            trend="up"
            trendText="15% increase from last month"
          />
        </div>
        <div className={styles.row}>{/* Widget: Average graph */}</div>
        <div className={styles.row}>
          {/* Widget: Weakest consistency */}
          {/* Widget: Miss tendency */}
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
