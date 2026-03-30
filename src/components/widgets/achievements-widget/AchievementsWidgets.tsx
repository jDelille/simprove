import React from 'react'
import styles from "./AchievementsWidget.module.scss";

type AchievementsWidgetsProps = {
  userId: string;
};

const AchievementsWidgets: React.FC<AchievementsWidgetsProps> = ({ userId }) => {
  return (
    <div className={styles.achievementsWidget}>
        <div className={styles.header}>
            <p>Achievements</p>
            <span>4 of 12 earned</span>
        </div>
        <div className={styles.content}>
            <p>No achievements to display.</p>
        </div>
    </div>
  )
}

export default AchievementsWidgets