import React from "react";
import styles from "./StrokesGainedWidget.module.scss";

const StrokesGainedWidget = () => {
  return (
    <div className={styles.strokesGainedWidget}>
      <div className={styles.header}>
        <p>Strokes Gained Estimate</p>
        <span>See how many strokes each area of your game are costing you</span>
      </div>

      <div className={styles.content}>
        <div className={styles.area}>
          <span>Driving</span>
          <p className={styles.value}>+0.4</p>
          <div className={styles.progressBar}>
            <div className={styles.fill}></div>
          </div>
          <p className={styles.percent}>55% fairways</p>
        </div>
        <div className={styles.area}>
          <span>Approach</span>
          <p className={styles.value}>+0.4</p>
          <div className={styles.progressBar}>
            <div className={styles.fill}></div>
          </div>
          <p className={styles.percent}>55% fairways</p>
        </div>
        <div className={styles.area}>
          <span>Short Game</span>
          <p className={styles.value}>+0.4</p>
          <div className={styles.progressBar}>
            <div className={styles.fill}></div>
          </div>
          <p className={styles.percent}>55% fairways</p>
        </div>
        <div className={styles.area}>
          <span>Putting</span>
          <p className={styles.value}>+0.4</p>
          <div className={styles.progressBar}>
            <div className={styles.fill}></div>
          </div>
          <p className={styles.percent}>55% fairways</p>
        </div>
      </div>

      <div className={styles.leak}>
        <p>
          Biggest leak: Approach play is costing an estimated{" "}
          <strong>2.1 shots per round</strong>
        </p>
      </div>
    </div>
  );
};

export default StrokesGainedWidget;
