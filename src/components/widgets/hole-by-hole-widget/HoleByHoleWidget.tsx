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

  const toParColor = (diff: number) => {
  if (diff <= -2) return "var(--eagle)";
  if (diff === -1) return "var(--birdie)";
  if (diff === 0) return "var(--par)";
  if (diff === 1) return "var(--bogey)";
  if (diff === 2) return "var(--doubleBogey)";
  return "var(--triplePlus)";
};

  const chartOptions = useMemo(() => {
    const sorted = [...roundHoles].sort(
      (a, b) => a.hole_number - b.hole_number,
    );
    console.log(sorted);
    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 250,
        animation: false,
      },
      title: { text: "" },
      credits: { enabled: false },
      legend: { enabled: false },

      xAxis: {
        categories: sorted.map((r) => r.hole_number),
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
          data: sorted.map((r) => ({
            y: r.strokes,
            color: scoreColor(r.strokes, r.par),
            hole: r.hole_number,
            par: r.par,
            strokes: r.strokes,
            diff: r.strokes - r.par,
          })),
        },
      ],
      tooltip: {
        useHTML: true,
        backgroundColor: "transparent",
        borderWidth: 0,
        shadow: false,
        padding: 0,

        formatter: function (this: any) {
          const diff = this.point.diff;
          const hole = this.point.hole;
          const par = this.point.par;
          const strokes = this.point.strokes;

          let label = "Par";
          if (diff <= -2) label = "Eagle or better";
          else if (diff === -1) label = "Birdie";
          else if (diff === 1) label = "Bogey";
          else if (diff === 2) label = "Double Bogey";
          else if (diff >= 3) label = "Triple+";

          const diffText = diff > 0 ? `+${diff}` : diff === 0 ? "E" : `${diff}`;

          return `
      <div class="${styles.tooltip}">
        <div class="${styles.tooltipClub}">
          Hole ${hole}
        </div>

        <div class="${styles.tooltipValue}">
          <ul>
            <li>Score: <span style="color:${toParColor(diff)}">${strokes}</span></li>
            <li>Par: <span>${par}</span></li>
            <li>To Par: <span style="color:${toParColor(diff)}">${diffText} (${label})</span></li>
          </ul>
        </div>
      </div>
    `;
        },
      },
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
