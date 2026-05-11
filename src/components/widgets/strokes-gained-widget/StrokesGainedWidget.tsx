import React from "react";
import styles from "./StrokesGainedWidget.module.scss";
import { Round } from "@/types/round";
import Button from "@/components/ui/button/Button";
import { FiUpload } from "react-icons/fi";
import NoDataPlaceholderWidget from "@/components/ui/no-data-placeholder-widget/NoDataPlaceholderWidget";

type StrokesGainedWidgetProps = {
  rounds: Round[];
};

const StrokesGainedWidget = ({ rounds }: StrokesGainedWidgetProps) => {
  const hasNoRounds = !rounds || rounds.length === 0;
  const emptyAreas = ["Driving", "Approach", "Short Game", "Putting"];

  if (hasNoRounds) {
    return (
    <div className={styles.strokesGainedWidget} id="strokes-gained">
      <div className={styles.header}>
        <p>Strokes Gained Estimate</p>
        <span>See how many strokes each area of your game is costing you</span>
      </div>
      <div className={styles.content}>
        {emptyAreas.map((name) => (
          <div key={name} className={styles.area}>
            <span>{name}</span>
            <p className={styles.value}>-</p>
            <div className={styles.progressBar}>
              <div className={styles.fill} style={{ width: "0%" }} />
            </div>
            <p className={styles.percent}>No data yet</p>
          </div>
        ))}
      </div>
      <NoDataPlaceholderWidget
        icon={<FiUpload size={30} color="var(--lightgray)" />}
        title="Upload a round to get started"
        message="Your strokes gained estimate will appear here once you upload round data."
      />
    </div>
    );
  }

  const scores = (rounds ?? []).map((r) => r.round_scores?.[0]).filter(Boolean);

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const drivingSG =
    (avg(scores.map((s) => s.fairways_value_percent)) - 60) / 20;

  const approachSG = (avg(scores.map((s) => s.greens_value_percent)) - 55) / 18;

  const shortGameSG = avg(
    scores.map((s) => {
      const penalties = s.bogey + s.double_bogey * 1.5 + s.other * 2;

      const bogeyAvoidance = Math.max(0, 100 - penalties * 8);

      const shortGame = s.sand_saves_value_percent * 0.7 + bogeyAvoidance * 0.3;

      return (shortGame - 60) / 20;
    }),
  );

  const puttingSG = avg(
    scores.map((s) => {
      const putts = s.putts_value;
      const normalized = 100 - ((putts - 18) / 18) * 100;

      return (normalized - 65) / 20;
    }),
  );

  const data = [
    { name: "Driving", value: drivingSG, percent: 55 },
    { name: "Approach", value: approachSG, percent: 50 },
    { name: "Short Game", value: shortGameSG, percent: 38 },
    { name: "Putting", value: puttingSG, percent: 63 },
  ];

  const weakest = data.reduce((min, curr) =>
    curr.value < min.value ? curr : min,
  );

  return (
    <div className={styles.strokesGainedWidget} id="strokes-gained">
      <div className={styles.header}>
        <p>Strokes Gained Estimate</p>
        <span>See how many strokes each area of your game is costing you</span>
      </div>

      <div className={styles.content}>
        {data.map((area) => (
          <div key={area.name} className={styles.area}>
            <span>{area.name}</span>

            <p className={styles.value}>
              {area.value > 0 ? "+" : ""}
              {area.value.toFixed(1)}
            </p>

            <div className={styles.progressBar}>
              <div
                className={styles.fill}
                style={{
                  width: `${Math.min(100, Math.abs(area.value) * 50)}%`,
                }}
              />
            </div>

            <p className={styles.percent}>{area.percent}% baseline metric</p>
          </div>
        ))}
      </div>

      <div className={styles.leak}>
        <p>
          Biggest leak: <strong>{weakest.name}</strong> is costing you{" "}
          <strong>
            {Math.abs(weakest.value).toFixed(1)} strokes per round
          </strong>
        </p>
      </div>
    </div>
  );
};

export default StrokesGainedWidget;
