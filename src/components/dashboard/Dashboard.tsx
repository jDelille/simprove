import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      {/* left side */}
      <div className={styles.column}>
        <div className={styles.row}>
            {/* Widget: Total shots tracked */}
            {/* Widget: Sessions this month */}
            {/* Widget: Longest carry */}
            {/* Widget: Most practiced club */}
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
