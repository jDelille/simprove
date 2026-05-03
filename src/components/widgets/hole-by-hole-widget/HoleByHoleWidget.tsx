"use client";

import React, { useMemo } from "react";
import styles from "./HoleByHoleWidget.module.scss";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

type HoleByHoleProps = {
  roundHoles: any[];
};

const HoleByHoleWidget = ({ roundHoles }: HoleByHoleProps) => {
  
  const scoreColor = (strokes: number, par: number) => {
    const diff = strokes - par;
    if (diff <= -2) return "var(--eagle)";
    if (diff === -1) return "var(--birdie)";
    if (diff === 0) return "var(--par)";
    if (diff === 1) return "var(--bogey)";
    if (diff === 2) return "var(--doubleBogey)";
    return "var(--triplePlus)";
  };

  const LEGEND_ITEMS = [
    { label: "Eagle or better", color: "var(--eagle)" },
    { label: "Birdie", color: "var(--birdie)" },
    { label: "Par", color: "var(--par)" },
    { label: "Bogey", color: "var(--bogey)" },
    { label: "Double Bogey", color: "var(--doubleBogey)" },
    { label: "Triple+", color: "var(--triplePlus)" },
  ];

  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 300,
        animation: false,
      },
      title: { text: "" },
      credits: { enabled: false },
      legend: { enabled: false },

      xAxis: {
        categories: roundHoles.map((r) => r.hole_number),
        lineWidth: 0,
        tickLength: 0,
        labels: {
          style: { color: "var(--lightgray)", fontSize: "12px" },
        },
      },

      yAxis: {
        title: { text: "" },
        gridLineWidth: 0,
        lineWidth: 0,
        gridLineColor: "var(--border)",
        labels: { enabled: false },
      },

      plotOptions: {
        column: {
          borderRadius: { radius: 3, where: "end" },
          borderWidth: 0,
          animation: { duration: 800, easing: "easeOutBounce" },
        },
      },

      series: [
        {
          type: "column",
          data: roundHoles.map((r) => ({
            y: r.strokes,
            color: scoreColor(r.strokes, r.par),
          })),
        },
      ],
    };
  }, [roundHoles]);

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Hole by Hole</p>
        <span>Score vs Par</span>
      </div>
      <div className={styles.content}>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <div className={styles.legend}>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoleByHoleWidget;
