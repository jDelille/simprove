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

const AveragesGraphWidget: React.FC<AveragesGraphWidgetProps> = ({
  userId,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("avgCarry");
  const { data: sessions = [], isLoading } = useSessions(userId);

  console.log(sessions)


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

  // Define labels + units
  const controls: { key: MetricKey; label: string; unit?: string }[] = [
    { key: "avgCarry", label: "Avg Carry", unit: "yds" },
    { key: "avgSpeed", label: "Avg Ball Speed", unit: "mph" },
    { key: "avgOffline", label: "Avg Offline", unit: "yds" },
    { key: "avgSpin", label: "Avg Back Spin", unit: "rpm" },
    { key: "count", label: "Total Shots" },
  ];

  const metric = controls.find((c) => c.key === selectedMetric);

  const clubStats = getClubAverages(sessions.flatMap((s) => s.shots));

  const clubStatsArray = Object.entries(clubStats)
    .map(([club, stats]) => ({ club, ...stats }))
    .sort((a, b) => clubOrder.indexOf(a.club) - clubOrder.indexOf(b.club));

  const chartOptions = useMemo(() => {
    const categories = clubStatsArray.map((s) => s.club);
    const seriesData = clubStatsArray.map((s) => ({
      name: s.club,
      y: s[selectedMetric] || 0,
      color: "var(--chartGreen)",
    }));

    return {
      chart: {
        type: "column",
        backgroundColor: "transparent",
        height: 350,
        animation: false,
      },
      title: { text: "" },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories,
        lineWidth: 0,
        tickLength: 0,
        labels: {
          style: {
            color: "var(--lightgray)", 
            fontSize: "12px",
          },
        },
      },
      yAxis: {
        title: { text: undefined },
        gridLineWidth: 1,
        lineWidth: 0,
        gridLineColor: "var(--border)",
        labels: {
          style: {
            color: "var(--lightgray)", 
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        useHTML: true,
        backgroundColor: "transparent",
        borderWidth: 0,
        shadow: false,
        padding: 0,
        positioner: function (
          this: Highcharts.Tooltip,
          labelWidth: number,
          labelHeight: number,
          point: Highcharts.Point,
        ): { x: number; y: number } {
          const chart = this.chart;
          const plotLeft = chart.plotLeft;
          const plotTop = chart.plotTop;
          const plotWidth = chart.plotWidth;

          const pointX = plotLeft + (point.plotX ?? 0);
          const pointY = plotTop + (point.plotY ?? 0);

          const rightEdge = plotLeft + plotWidth;

          let x = pointX + 40;
          let y = pointY - labelHeight / 3;

          if (x + labelWidth > rightEdge) x = pointX - labelWidth - 20;
          if (y < plotTop) y = plotTop;

          return { x, y };
        },
        formatter: function (this: Highcharts.Point) {
          const metricUnit = metric?.unit ? ` ${metric.unit}` : "";
          return `
            <div class="${styles.tooltip}">
              <div class="${styles.tooltipClub}">${this.name}</div>
              <div class="${styles.tooltipValue}">
                <ul>
                  <li>${metric?.label}: <span>${Number(this.y).toFixed(1)}${metricUnit}</span></li>
                  <li>Total Shots: <span>${Number(this.y).toFixed(0)}</span></li>
                </ul>
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        column: {
          borderRadius: { where: "all", radius: 6 },
          borderWidth: 0,
          animation: { duration: 800, easing: "easeOutBounce" },
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
                chart.series[0].points.forEach((p: any) => {
                  if (p !== this)
                    p.graphic.animate({ opacity: 0.1 }, { duration: 200 });
                });
              },
              mouseOut: function (this: Highcharts.Point) {
                const chart = this.series.chart;
                chart.series[0].points.forEach((p: any) => {
                  p.graphic.animate({ opacity: 1 }, { duration: 200 });
                });
              },
            },
          },
        },
      ],
    };
  }, [selectedMetric, clubStatsArray, metric]);

  return (
    <div className={styles.graphContainer}>
      <div className={styles.header}>
        <div className={styles.text}>
          <p className={styles.selectedMetric}>{metric?.label}</p>
          <span>Performance by club</span>
        </div>

        <div className={styles.chartControls}>
          {controls.map((c) => (
            <div
              key={c.key}
              className={
                c.key === selectedMetric ? styles.activeControl : styles.control
              }
              onClick={() => setSelectedMetric(c.key)}
            >
              <p>{c.label}</p>
            </div>
          ))}
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default AveragesGraphWidget;
