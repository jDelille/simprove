"use client";

import React from "react";
import styles from "./TopClubsWidget.module.scss";

const TopClubsWidget = () => {
  const stats = [
    { id: 1, label: "7I", value: 842, avgYards: 163 },
    { id: 2, label: "5I", value: 567, avgYards: 190 },
    { id: 3, label: "3I", value: 123, avgYards: 210 },
    { id: 4, label: "DR", value: 456, avgYards: 250 },
    { id: 5, label: "PW", value: 789, avgYards: 120 },
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Top Clubs</p>
        <button>All</button>
      </div>

      <div className={styles.content}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.stat}>
            <p className={styles.label}>{stat.label}</p>
            <div className={styles.body}>
              <div className={styles.bar}>
                <div className={styles.fill}></div>
              </div>
              <div className={styles.values}>
                <p className={styles.value}>
                  {stat.value} <span>shots</span>
                </p>
                <p> · </p>
                <p className={styles.avgYards}>
                  {stat.avgYards} <span>avg yards</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopClubsWidget;
