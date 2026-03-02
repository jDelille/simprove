"use client";

import React, { useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import styles from "./AveragesGraphWidget.module.scss";

const AveragesGraphWidget: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<any>("avgCarry");

  // Dummy average yard data
  const clubStats = [
    { club: "DR", avgYards: 255, avgOffline: 12 },
    { club: "3W", avgYards: 230, avgOffline: 10 },
    { club: "5W", avgYards: 215, avgOffline: 8 },
    { club: "3I", avgYards: 190, avgOffline: 10 },
    { club: "4I", avgYards: 180, avgOffline: 6 },
    { club: "5I", avgYards: 170, avgOffline: 8 },
    { club: "6I", avgYards: 175, avgOffline: 4 },
    { club: "7I", avgYards: 165, avgOffline: 12 },
    { club: "8I", avgYards: 155, avgOffline: 8 },
    { club: "9I", avgYards: 140, avgOffline: 8 },
    { club: "PW", avgYards: 125, avgOffline: 8 },
    { club: "GW", avgYards: 110, avgOffline: 7 },
    { club: "SW", avgYards: 95, avgOffline: 4 },
    { club: "LW", avgYards: 80, avgOffline: 4 },
  ];

  const chartOptions = useMemo(() => {
    const categories = clubStats.map((stat) => stat.club);

    const seriesData = clubStats.map((stat) => ({
      name: stat.club,
      y: stat.avgOffline,
      color: "#2ABB7F",
    }));

    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 350,
        animation: false,
      },
      title: {
        text: "",
        style: {
          fontSize: "14px",
          fontWeight: "600",
        },
      },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories,
        lineWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            fontSize: "11px",
            fontWeight: "500",
            color: "var(--lightgray)",
          },
        },
      },
      yAxis: {
        title: { text: undefined },
        gridLineWidth: 1,
        gridLineColor: "var(--border)",
        lineWidth: 0,
        labels: {
          style: {
            color: "var(--lightgray)",
            fontSize: "11px",
            fontWeight: "500",
          },
        },
        animation: false,
      },
      plotOptions: {
        column: {
          borderRadius: 4,
          borderWidth: 0,
          animation: {
            duration: 800,
            easing: "easeOutBounce",
          },
        },
      },
      series: [
        {
          type: "column",
          data: seriesData,
        },
      ],
    };
  }, []);

  const controls = [
    { label: "Avg Carry", key: "avgCarry" },
    { label: "Avg Offline", key: "avgOffline" },
    { label: "Avg Ball Speed", key: "avgBallSpeed" },
    { label: "Avg Back Spin", key: "avgBackSpin" },
  ];

  return (
    <div className={styles.graphContainer}>
      <div className={styles.header}>
        <div className={styles.text}>
          <p className={styles.selectedMetric}>{selectedMetric}</p>
          <span>Say something here</span>
        </div>

        <div className={styles.chartControls}>
          {controls.map((control) => (
            <div
              key={control.key}
              className={
                control.key === selectedMetric
                  ? styles.activeControl
                  : styles.control
              }
              onClick={() =>
                setSelectedMetric(control.key as keyof (typeof clubStats)[0])
              }
            >
              <p>{control.label}</p>
            </div>
          ))}
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default AveragesGraphWidget;