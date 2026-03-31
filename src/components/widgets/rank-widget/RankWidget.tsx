import React from "react";
import styles from "./RankWidget.module.scss";

type RankWidgetProps = {};

const RankWidget: React.FC<RankWidgetProps> = () => {
  return (
    <div className={styles.rank}>
      <div className={styles.labels}>
        <div className={styles.label}>
          <p>Bogey I</p>
          <span>Current rank</span>
        </div>
        <div className={styles.label}>
          <p>Bogey II</p>
          <span>Next rank</span>
        </div>
      </div>
      <div className={styles.progress}>
        <div className={styles.fill}></div>
      </div>
      <div className={styles.points}>
        <p>250 / 1000 pts to next rank</p>
      </div>
    </div>
  );
};

export default RankWidget;
