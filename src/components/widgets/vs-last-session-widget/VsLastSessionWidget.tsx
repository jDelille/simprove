import React from "react";
import styles from "./VsLastSessionWidget.module.scss";

const VsLastSessionWidget = () => {
  const data = [
    {
      id: 1,
      title: "Best Carry",
      value: 100,
      metric: "yds",
      trend: "up",
      trendText: "11",
    },
    {
      id: 2,
      title: "Avg Ball Speed",
      value: 100,
      metric: "mph",
      trend: "down",
      trendText: "5",
    },
    {
      id: 3,
      title: "Avg Offline",
      value: 15,
      metric: "yds",
      trend: "up",
      trendText: "2",
    },
    {
        id: 4,
        title: "Avg Backspin",
        value: 100,
        metric: "rpm",
        trend: "up",
        trendText: "10",
    },
    {
      id: 5,
      title: "Shots hit",
      value: 200,
      metric: "shots",
      trend: "up",
      trendText: "20",
    },
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Vs Last Session</p>
      </div>
      <ul className={styles.stats}>
        {data.map((stat) => (
          <li key={stat.id} className={styles.statItem}>
            <p className={styles.statTitle}>{stat.title}</p>
            <div className={styles.statValue}>
              <p>{stat.value} <span className={styles.metric}>{stat.metric}</span></p>
              <div className={styles.trend}>
                <p>{stat.trend === "up" ? "+" : "-"}{stat.trendText} </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VsLastSessionWidget;
