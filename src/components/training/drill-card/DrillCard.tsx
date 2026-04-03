import React, { useState } from "react";
import styles from "./DrillCard.module.scss";

type DrillCardProps = {
  drill: any;
};

const DrillCard: React.FC<DrillCardProps> = ({ drill }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCurrent = drill.is_active;
  const isCompleted = drill.status === "completed";

  return (
    <div
      className={
        isCurrent ? styles.drillCard + " " + styles.current : styles.drillCard
      }
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={styles.drillInfo}>
        <div className={isCompleted ? styles.completed : styles.inactive}></div>
        <p className={styles.week}>Week {drill.week_number}</p>
        <p>—</p>
        <p className={styles.drillName}>{drill.drill_name}</p>
        {isCurrent && <p className={styles.currentArrow}>← Current</p>}
        <p className={styles.points}>{drill.points} pts</p>
      </div>

      {isOpen && (
        <div className={styles.drillDetails}>
          <div className={styles.drillDescription}>
            <div className={isCompleted ? styles.completed : styles.inactive}></div>
            {drill.drill_description}
            <div className={styles.points}>{drill.points}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillCard;
