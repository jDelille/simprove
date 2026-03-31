"use client";

import { useState } from "react";
import styles from "./SwingMetricsWidget.module.scss";

type SwingMetricsWidgetProps = {
  shots: any[];
};

const SwingMetricsWidget: React.FC<SwingMetricsWidgetProps> = ({ shots }) => {
  const [selectedClub, setSelectedClub] = useState("DR");
  const clubs = ["DR", "W5", "I7", "PW", "SW"];

  const isEmpty = shots.length === 0;

  const clubShots = shots.filter((shot) => shot.club === selectedClub);
  const avgPath =
    clubShots.reduce((sum, shot) => sum + shot.path, 0) / clubShots.length || 0;
  const avgFace =
    clubShots.reduce((sum, shot) => sum + shot.faceToTarget, 0) /
      clubShots.length || 0;
  const avgAttack =
    clubShots.reduce((sum, shot) => sum + shot.aoa, 0) / clubShots.length || 0;

  const pathLabel = (val: number) => {
    if (val < -2)
      return {
        text: "Over the top",
        color: "var(--metricBadText)",
        background: "var(--metricBadBG)",
      };
    if (val > 2)
      return {
        text: "In to out",
        color: "var(--metricOkayText)",
        background: "var(--metricOkayBG)",
      };
    return {
      text: "On plane",
      color: "var(--metricGoodText)",
      background: "var(--metricGoodBG)",
    };
  };

  const faceLabel = (val: number) => {
    if (val > 1.5)
      return {
        text: "Open",
        color: "var(--metricBadText)",
        background: "var(--metricBadBG)",
      };
    if (val < -1.5)
      return {
        text: "Closed",
        color: "var(--metricOkayText)",
        background: "var(--metricOkayBG)",
      };
    return {
      text: "Square",
      color: "var(--metricGoodText)",
      background: "var(--metricGoodBG)",
    };
  };

  const aoaLabel = (val: number) => {
    if (val < -3)
      return {
        text: "Steep",
        color: "var(--metricBadText)",
        background: "var(--metricBadBG)",
      };
    if (val > 1)
      return {
        text: "Upward",
        color: "var(--metricOkayText)",
        background: "var(--metricOkayBG)",
      };
    return {
      text: "On plane",
      color: "var(--metricGoodText)",
      background: "var(--metricGoodBG)",
    };
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Swing Metrics</p>
        <span>Path · Face · Attack Angle</span>
      </div>
      <div className={styles.content}>
        <ul className={styles.clubs}>
          {clubs.map((club) => (
            <li
              key={club}
              className={club === selectedClub ? styles.selected : ""}
              onClick={() => setSelectedClub(club)}
              style={
                isEmpty
                  ? { cursor: "default", color: "var(--lightgray)" }
                  : undefined
              }
            >
              <p>{club}</p>
            </li>
          ))}
        </ul>
        <div className={styles.clubDetails}>
          <ul>
            <li>
              <div className={styles.metric}>
                <p style={isEmpty ? {color: "var(--lightgray)"} : undefined}>Club Path</p>
                <span>Within range, but your open face is amplifying it</span>
              </div>
              {!isEmpty && (
                <div className={styles.value}>
                  <p style={{ color: pathLabel(avgPath).color }}>
                    {avgPath.toFixed(1)}°
                  </p>
                  <div
                    className={styles.valueLabel}
                    style={{ background: pathLabel(avgPath).background }}
                  >
                    <p style={{ color: pathLabel(avgPath).color }}>
                      {pathLabel(avgPath).text}
                    </p>
                  </div>
                </div>
              )}
            </li>
            <li>
              <div className={styles.metric}>
                <p style={isEmpty ? {color: "var(--lightgray)"} : undefined}>Face Angle</p>
                <span>The gap that curves the ball</span>
              </div>
              {!isEmpty && (
                <div className={styles.value}>
                  <p style={{ color: faceLabel(avgFace).color }}>
                    {avgFace.toFixed(1)}°
                  </p>
                  <div
                    className={styles.valueLabel}
                    style={{ background: faceLabel(avgFace).background }}
                  >
                    <p style={{ color: faceLabel(avgFace).color }}>
                      {faceLabel(avgFace).text}
                    </p>
                  </div>
                </div>
              )}
            </li>
            <li>
              <div className={styles.metric}>
                <p style={isEmpty ? {color: "var(--lightgray)"} : undefined}>Attack Angle</p>
                <span>Hitting up slightly would boost distance</span>
              </div>
              {!isEmpty && (
                <div className={styles.value}>
                  <p style={{ color: aoaLabel(avgAttack).color }}>
                    {avgAttack.toFixed(1)}°
                  </p>
                  <div
                    className={styles.valueLabel}
                    style={{ background: aoaLabel(avgAttack).background }}
                  >
                    <p style={{ color: aoaLabel(avgAttack).color }}>
                      {aoaLabel(avgAttack).text}
                    </p>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SwingMetricsWidget;
