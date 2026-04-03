"use client";

import React, { useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import styles from "./AveragesGraphWidget.module.scss";
import { getClubAverages } from "@/lib/shots/averages";
import { useSessions } from "@/hooks/useSessions";
import Button from "@/components/button/Button";
import { FaChartBar } from "react-icons/fa";
import useModal from "@/hooks/useModal";
import Modal from "@/components/modal/Modal";
import UploadCsv from "@/components/upload-csv/UploadCsv";

type AveragesGraphWidgetProps = {
  userId: string;
};

type MetricKey = "avgCarry" | "avgSpeed" | "avgOffline" | "avgSpin" | "count";

const AveragesGraphWidget: React.FC<AveragesGraphWidgetProps> = ({
  userId,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("avgCarry");
  const { data: sessions = [], isLoading } = useSessions(userId);
  const { openModal, modals, closeModal } = useModal();

  const isEmpty = sessions.length === 0;

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
    { key: "avgCarry", label: "Carry", unit: "yds" },
    { key: "avgSpeed", label: "Ball Speed", unit: "mph" },
    { key: "avgOffline", label: "Offline", unit: "yds" },
    { key: "avgSpin", label: "Back Spin", unit: "rpm" },
    { key: "count", label: "Total Shots" },
  ];

  const metric = controls.find((c) => c.key === selectedMetric);

  const clubStats = getClubAverages(sessions.flatMap((s: any) => s.shots));

  const clubStatsArray = Object.entries(clubStats)
    .map(([club, stats]) => ({ club, ...stats }))
    .sort((a, b) => clubOrder.indexOf(a.club) - clubOrder.indexOf(b.club));

  const chartOptions = useMemo(() => {
    const categories = clubStatsArray.map((s) => s.club);
    const seriesData = clubStatsArray.map((s) => ({
      name: s.club,
      y: s[selectedMetric] || 0,
      color: "var(--chartBlue)",
    }));

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
        gridLineWidth: 0,
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
          borderRadius: { radius: 2},
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
      {!isEmpty ? (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <FaChartBar size={40} color="var(--lightgray)" />
          </div>
          <p>No shots tracked yet</p>
          <p className={styles.msg}>
            Your {selectedMetric} by club will chart here once you upload a
            session with shot data.
          </p>
          <Button
            children="Upload a session"
            variant="lessonCard"
            onClick={() => openModal("upload")}
          />
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={modals["upload"] || false}
        onClose={() => closeModal("upload")}
        title="Upload Lauch Monitor Data"
        body={<UploadCsv />}
        description="Upload a CSV file file your launch monitor. (Trackman, FlightScope, Square Golf, etc.)"
      />
    </div>
  );
};

export default AveragesGraphWidget;
