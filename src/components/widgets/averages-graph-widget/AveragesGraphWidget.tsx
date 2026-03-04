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
      color: "var(--chartGreen)",
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
            fontWeight: "700",
            color: "var(--lightgray)",
          },
        },
      },
      yAxis: {
        title: { text: undefined },
        gridLineWidth: 0,
        gridLineColor: "var(--border)",
        lineWidth: 0,
        labels: {
          style: {
            color: "var(--lightgray)",
            fontSize: "11px",
            fontWeight: "700",
          },
        },
        animation: false,
      },
      tooltip: {
        useHTML: true,
        backgroundColor: "transparent",
        borderWidth: 0,
        shadow: false,
        padding: 0,
        shape: "square",

        style: {
          background: "transparent",
        },

        positioner: function (
          this: Highcharts.Tooltip,
          labelWidth: number,
          labelHeight: number,
          point: Highcharts.Point,
        ) {
          const chart = this.chart;

          const plotLeft = chart.plotLeft;
          const plotTop = chart.plotTop;
          const plotWidth = chart.plotWidth;

          const pointX = plotLeft + (point.plotX ?? 0);
          const pointY = plotTop + (point.plotY ?? 0);

          const rightEdge = plotLeft + plotWidth;

          let x = pointX + 40;
          let y = pointY - labelHeight / 3;

          if (x + labelWidth > rightEdge) {
            x = pointX - labelWidth - 20;
          }

          if (y < plotTop) {
            y = plotTop;
          }

          return { x, y };
        },

        formatter: function (this: Highcharts.Point) {
          return `
      <div class="${styles.tooltip}">
        <div class="${styles.tooltipClub}">
          ${this.name}
        </div>
        <div class="${styles.tooltipValue}">
          <ul>
            <li>
              Average carry: <span>${Number(this.y).toFixed(1)}</span>
            </li>
            <li>
              Total shots: <span>${Number(this.y).toFixed(1)}</span>
            </li>
          </ul>
        </div>
      </div>
    `;
        },
      },
      plotOptions: {
        column: {
          borderRadius: {
            where: "all",
            radius: 6,
          },
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
          point: {
            events: {
              mouseOver: function (this: Highcharts.Point) {
                const chart = this.series.chart;

                chart.series[0].points.forEach((point: any) => {
                  if (point !== this) {
                    point.graphic.animate({ opacity: 0.1 }, { duration: 200 });
                  }
                });
              },
              mouseOut: function (this: Highcharts.Point) {
                const chart = this.series.chart;

                chart.series[0].points.forEach((point: any) => {
                  point.graphic.animate({ opacity: 1 }, { duration: 200 });
                });
              },
            },
          },
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
              onClick={() => setSelectedMetric(control.key as MetricKey)}
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
