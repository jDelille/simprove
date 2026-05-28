import React from "react";
import styles from "./CareerStatsWidget.module.scss";
import { Averages, RoundStats } from "@/lib/shots/averages";

type CareerStatsWidgetProps = {
  stats: Averages & RoundStats & { totalSessions: number; totalPoints: number; };
};
const CareerStatsWidget = ({ stats }: CareerStatsWidgetProps) => {
  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Career Stats</p>
      </div>
      <ul>
        <li>
          <p>Total shots</p>
          <p className={styles.value}>{stats.count}</p>
        </li>
        <li>
          <p>Total rounds</p>
          <p className={styles.value}>{stats.totalRounds}</p>
        </li>
        <li>
          <p>Total sessions</p>
          <p className={styles.value}>{stats.totalSessions}</p>
        </li>
        <li>
          <p>Total points</p>
          <p className={styles.value}>{stats.totalPoints || 0} pts </p>
        </li>
        <li>
          <p>Longest Carry</p>
          <p className={styles.value}>
            {stats.longestCarry?.toFixed(1) || 0} yds
          </p>
        </li>
        <li>
          <p>Best ball speed</p>
          <p className={styles.value}>
            {stats.peakBallSpeed?.toFixed(1) || 0} mph
          </p>
        </li>
        <li>
          <p>Most used club</p>
          <p className={styles.value}>{stats.mostUsedClub || "N/A"}</p>
        </li>
        <li>
          <p>Best Score</p>
          <p className={styles.value}>{stats.bestScore || "N/A"}</p>
        </li>
        <li>
          <p>Avg GIR</p>
          <p className={styles.value}>{(stats.avgGIR * 100).toFixed(0)}%</p>
        </li>
        <li>
          <p>Avg FIR</p>
          <p className={styles.value}>{(stats.avgFIR * 100).toFixed(0)}%</p>
        </li>
        <li>
          <p>Avg putts through 18</p>
          <p className={styles.value}>{stats.avgPutts?.toFixed(1)}</p>
        </li>
      </ul>
    </div>
  );
};

export default CareerStatsWidget;
