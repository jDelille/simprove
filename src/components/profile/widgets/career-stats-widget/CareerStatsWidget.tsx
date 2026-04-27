import React from "react";
import styles from "./CareerStatsWidget.module.scss";

type CareerStatsWidgetProps = {};
const CareerStatsWidget = ({}: CareerStatsWidgetProps) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Career Stats</p>
      </div>

      <ul>
        <li>
          <p>Total shots</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Total rounds</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Total sessions</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Total points</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Longest Carry</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Best ball speed</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Most used club</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Best Score</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Avg GIR</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Avg FIR</p>
          <p className={styles.value}>0</p>
        </li>
        <li>
          <p>Avg putts</p>
          <p className={styles.value}>0</p>
        </li>
      </ul>
    </div>
  );
};

export default CareerStatsWidget;
