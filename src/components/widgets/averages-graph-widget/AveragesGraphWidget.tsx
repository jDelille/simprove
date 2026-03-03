"use client";

import React, { useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import styles from "./AveragesGraphWidget.module.scss";
import { getClubAverages } from "@/lib/shots/averages";
import { useSessions } from "@/hooks/useSessions";

type AveragesGraphWidgetProps = {
  userId: string;
};

type MetricKey = "avgCarry" | "avgSpeed" | "avgOffline" | "avgSpin" | "count";

const AveragesGraphWidget: React.FC<AveragesGraphWidgetProps> = (props) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("avgCarry");
  const { data: sessions = [], isLoading } = useSessions(props.userId);
  const clubOrder = [
    "SW",
    "PW",
    "I9",
    "I8",
    "I7",
    "I6",
    "I5",
    "I4",
    "W5",
    "W3",
    "3H",
    "5H",
    "DR",
  ];

  const clubStats = getClubAverages(
    sessions.flatMap((session) => session.shots),
  );

  const clubStatsArray = Object.entries(clubStats)
    .map(([club, stats]) => ({ club, ...stats }))
    .sort((a, b) => clubOrder.indexOf(a.club) - clubOrder.indexOf(b.club));

  const chartOptions = useMemo(() => {
    const categories = clubStatsArray.map((stat) => stat.club);

    const seriesData = clubStatsArray.map((stat) => ({
      name: stat.club,
      y: stat[selectedMetric] || 0,
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
  }, [selectedMetric, clubStatsArray]);

  const controls = [
    { label: "Avg Carry", key: "avgCarry" },
    { label: "Avg Offline", key: "avgOffline" },
    { label: "Avg Ball Speed", key: "avgSpeed" },
    { label: "Avg Back Spin", key: "avgSpin" },
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
                setSelectedMetric(control.key as MetricKey)
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
