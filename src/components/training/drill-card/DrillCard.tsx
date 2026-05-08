import React, { useState } from "react";
import styles from "./DrillCard.module.scss";

type DrillCardProps = {
  drill: any;
};

const DrillCard: React.FC<DrillCardProps> = ({ drill }) => {
  const isCurrent = drill.status === "active";
  const isCompleted = drill.status === "completed";

  console.log(drill)

  return (
    <div
      className={
        isCurrent ? styles.drillCard + " " + styles.current : styles.drillCard
      }
    >
      <div className={styles.drillInfo}>
        <div className={isCompleted ? styles.completed : styles.inactive}>
          {drill.drill_order}
        </div>
        <p className={styles.drillName}>{drill.drill_description}</p>
        {isCurrent && <p className={styles.currentArrow}>← Current</p>}
        <p className={styles.points}>{drill.points} pts</p>
      </div>
    </div>
  );
};

export default DrillCard;
