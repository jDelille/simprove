"use client";

import { useMemo, useState } from "react";
import styles from "./SessionShotsGraphWidget.module.scss";
import { Session } from "@/types/session";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { FaArrowDown, FaChevronDown } from "react-icons/fa";

type MetricKey = "carry" | "ballSpeed" | "offline" | "backSpin";

type SessionShotsGraphWidgetProps = {
  session: Session;
};

const SessionShotsGraphWidget = ({ session }: SessionShotsGraphWidgetProps) => {
  const [selectedClub, setSelectedClub] = useState<string>("SW");
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("carry");
  const [isOpen, setIsOpen] = useState(false);

  const clubs = Array.from(new Set(session.shots.map((shot) => shot.club)));

  const club = clubs.find((c) => c === selectedClub);

  const shots = session.shots;

  const filteredShots = shots.filter((shot) => shot.club === selectedClub);

  const chartData = filteredShots.map((shot, i) => ({
    x: i + 1,
    y: shot[selectedMetric] ?? 0,
  }));

  const avg =
    filteredShots.reduce((sum, shot) => {
      return sum + (shot[selectedMetric] ?? 0);
    }, 0) / (filteredShots.length || 1);

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
        categories: chartData.map((d, index) => ` ${index}`),
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
        title: { text: "" },
        gridLineWidth: 0,
        lineWidth: 0,
        gridLineColor: "var(--border)",
        labels: {
          style: {
            color: "var(--lightgray)",
            fontSize: "12px",
          },
        },
        plotLines: [
          {
            value: avg,
            color: "var(--chartLine)",
            width: 2,
            dashStyle: "Solid",
            zIndex: 4,
            label: {
              text: `${avg.toFixed(1)} `, // add metric
              y: -10,
              align: "left",
              style: {
                color: "var(--text)",
                fontWeight: "bold",
              },
            },
          },
        ],
      },

      tooltip: {
        formatter: function (this: Highcharts.Point) {
          return `
    <b>Shot ${this.x}</b><br/>
    ${selectedMetric}: ${this.y?.toFixed(1)}
  `;
        },
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
          data: chartData,
          color: "var(--chartBlue)",
        },
      ],
    };
  }, [filteredShots, selectedMetric]);

  return (
    <div className={styles.graphContainer}>
      <div className={styles.header}>
        <div className={styles.text}>
          <p className={styles.selectedClub}>{selectedClub}</p>
          <span>Performance by club</span>
        </div>

        <div className={styles.chartControls}>
          <div className={styles.dropdown}>
            <div
              className={styles.selected}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {selectedClub} <FaChevronDown size={14} color="var(--text)" />
            </div>

            {isOpen && (
              <div className={styles.menu}>
                {clubs
                  .filter((club) => club !== selectedClub)
                  .map((club) => (
                    <div
                      key={club}
                      className={styles.item}
                      onClick={() => {
                        setSelectedClub(club);
                        setIsOpen(false);
                      }}
                    >
                      {club}
                    </div>
                  ))}
              </div>
            )}
          </div>
          {["carry", "ballSpeed", "offline", "backSpin"].map((m) => (
            <div
              key={m}
              className={
                m === selectedMetric ? styles.activeControl : styles.control
              }
              onClick={() => setSelectedMetric(m as MetricKey)}
            >
              {m}
            </div>
          ))}
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default SessionShotsGraphWidget;
