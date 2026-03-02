import SmallStatWidget from "../widgets/small-stat-widget/SmallStatWidget";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row}>
            {/* Widget: Total shots tracked */}
            <SmallStatWidget 
                title="Total Shots Tracked"
                value={1234}
                metric="shots"
                trend="up"
                trendText="15% increase from last month"
            />
            {/* Widget: Sessions this month */}
            <SmallStatWidget 
                title="Sessions This Month"
                value={12}
                metric="sessions"
                trend="up"
                trendText="15% increase from last month"
            />
            {/* Widget: Longest carry */}
            <SmallStatWidget 
                title="Longest Carry"
                value={1234}
                metric="yards"
                trend="up"
                trendText="15% increase from last month"
            />
            {/* Widget: Most practiced club */}
            <SmallStatWidget 
                title="Most Practiced Club"
                value={"7I"}
                metric="shots"
                trend="up"
                trendText="15% increase from last month"
            />
        </div>
        <div className={styles.row}>
            {/* Widget: Average graph */}
        </div>
        <div className={styles.row}>
            {/* Widget: Weakest consistency */}
            {/* Widget: Miss tendency */}
        </div>
      </div>
      {/* right side */}
      <div className={styles.column}>
        <div className={styles.row}>
            {/* Widget: Recent activity */}
        </div>
        <div className={styles.row}>
            {/* Widget: Lesson plan */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
