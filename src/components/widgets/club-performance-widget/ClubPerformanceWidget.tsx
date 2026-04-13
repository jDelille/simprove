import React from "react";
import styles from "./ClubPerformanceWidget.module.scss";

type ClubPerformanceWidgetProps = {};

const ClubPerformanceWidget = ({}: ClubPerformanceWidgetProps) => {
  const data = [
    {
      id: 1,
      label: "avg carry",
      value: 210,
      metric: "yards",
    },
    {
      id: 2,
      label: "avg offline",
      value: -4.6,
      metric: "yards",
    },
    {
      id: 3,
      label: "avg spin",
      value: 2780,
      metric: "rpm",
    },
    {
      id: 4,
      label: "ball speed",
      value: 138,
      metric: "mph",
    },
    {
      id: 5,
      label: "avg launch angle",
      value: 45,
      metric: "deg",
    },
    {
      id: 6,
      label: "avg descent",
      value: 48,
      metric: "deg",
    },
  ];

  return (
    <div className={styles.clubPerformanceWidget}>
      <div className={styles.header}>
        <p>Club Performance</p>
        <span>Avg stats for selected club</span>
      </div>

      <div className={styles.content}>

        <div className={styles.club}>
            <p className={styles.clubName}>W5</p>
            <p>11 shots</p>
        </div>

        <ul className={styles.stats}>
          {data.map((item) => (
            <li key={item.id} className={styles.item}>
              <p className={styles.label}>{item.label}</p>
              <p className={styles.value}>
                {item.value} <span>{item.metric}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClubPerformanceWidget;
