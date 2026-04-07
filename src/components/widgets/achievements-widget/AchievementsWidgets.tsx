import React from "react";
import styles from "./AchievementsWidget.module.scss";

type AchievementsWidgetsProps = {
  userId: string;
  badges: any;
};

const AchievementsWidgets: React.FC<AchievementsWidgetsProps> = ({
  userId,
  badges,
}) => {
  return (
    <div className={styles.achievementsWidget}>
      <div className={styles.header}>
        <p>Achievements</p>
        <span>0 of {badges.length} earned</span>
      </div>
      <div className={styles.content}>
        {badges.map((badge: any) => (
          <div key={badge.id} className={styles.badge}>
            <p className={styles.icon}>{badge.icon}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsWidgets;
