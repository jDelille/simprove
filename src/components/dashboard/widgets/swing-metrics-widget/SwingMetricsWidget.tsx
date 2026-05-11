"use client";

import { useState } from "react";
import styles from "./SwingMetricsWidget.module.scss";
import ClubSelect from "@/components/club-select/ClubSelect";
import { Shot } from "@/types/shot";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiActivity } from "react-icons/fi";

type SwingMetricsWidgetProps = {
  shots: Shot[];
};

type RangeBarProps = {
  value: number;
  min: number;
  max: number;
  zones: {
    from: number;
    to: number;
    color: string;
  }[];
};

const RangeBar: React.FC<RangeBarProps> = ({ value, min, max, zones }) => {
  const toPercent = (val: number) =>
    Math.min(100, Math.max(0, ((val - min) / (max - min)) * 100));

  return (
    <div
      style={{
        position: "relative",
        height: "5px",
        background: "var(--messageBg)",
        borderRadius: "999px",
      }}
    >
      {zones.map((zone, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${toPercent(zone.from)}%`,
            width: `${toPercent(zone.to) - toPercent(zone.from)}%`,
            background: zone.color,
            borderRadius: "999px",
            border: `1px solid var(--border)`
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${toPercent(value)}%`,
          transform: "translate(-50%, -50%)",
          width: "13px",
          height: "13px",
          borderRadius: "50%",
          background: "var(--accent)",
          border: "2px solid var(--accent)",
        }}
      />
    </div>
  );
};

const SwingMetricsWidget: React.FC<SwingMetricsWidgetProps> = ({ shots }) => {
  const clubs = [...new Set(shots.map((shot) => shot.club))];
  const [selectedClub, setSelectedClub] = useState(clubs[0] || "");

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
    <div className={styles.widget} id="swing-metrics">
      <div className={styles.header}>
        <p>Swing Metrics <IoInformationCircleOutline /></p>
        <span>Path · Face · Attack Angle</span>
      </div>
      <div className={styles.content}>
        {!isEmpty && (
          <>
            <ClubSelect
              clubs={clubs}
              setSelectedClub={setSelectedClub}
              selectedClub={selectedClub}
            />

            <div className={styles.clubDetails}>
              <ul>
                <li>
                  <div className={styles.top}>
                    <div className={styles.metric}>
                      <p
                        style={
                          isEmpty ? { color: "var(--lightgray)" } : undefined
                        }
                      >
                        Club Path
                      </p>
                      <div className={styles.valueLabel}>
                        <p style={{ color: pathLabel(avgPath).color }}>
                          {pathLabel(avgPath).text}
                        </p>
                      </div>
                    </div>
                    {!isEmpty && (
                      <div className={styles.value}>
                        <p style={{ color: pathLabel(avgPath).color }}>
                          {avgPath.toFixed(1)}°
                        </p>
                      </div>
                    )}
                  </div>

                  <RangeBar
                    value={avgPath}
                    min={-10}
                    max={10}
                    zones={[
                      { from: -10, to: -2, color: "var(--zone-bad)" },
                      { from: -2, to: 2, color: "var(--zone-okay)" },
                      { from: 2, to: 10, color: "var(--zone-good)" },
                    ]}
                  />
                  <div className={styles.labels}>
                    <p>Closed</p>
                    <p>Square</p>
                    <p>Open</p>
                  </div>
                </li>
                <li>
                  <div className={styles.top}>
                    <div className={styles.metric}>
                      <p
                        style={
                          isEmpty ? { color: "var(--lightgray)" } : undefined
                        }
                      >
                        Face Angle
                      </p>
                      <div className={styles.valueLabel}>
                        <p style={{ color: faceLabel(avgFace).color }}>
                          {faceLabel(avgFace).text}
                        </p>
                      </div>
                    </div>
                    {!isEmpty && (
                      <div className={styles.value}>
                        <p style={{ color: faceLabel(avgFace).color }}>
                          {avgFace.toFixed(1)}°
                        </p>
                      </div>
                    )}
                  </div>
                  <RangeBar
                    value={avgFace}
                    min={-10}
                    max={10}
                    zones={[
                      { from: -10, to: -2, color: "var(--zone-bad)" },
                      { from: -2, to: 2, color: "var(--zone-okay)" },
                      { from: 2, to: 10, color: "var(--zone-good)" },
                    ]}
                  />
                  <div className={styles.labels}>
                    <p>Closed</p>
                    <p>Square</p>
                    <p>Open</p>
                  </div>
                </li>
                <li>
                  <div className={styles.top}>
                    <div className={styles.metric}>
                      <p
                        style={
                          isEmpty ? { color: "var(--lightgray)" } : undefined
                        }
                      >
                        Attack Angle
                      </p>
                      <div className={styles.valueLabel}>
                        <p style={{ color: aoaLabel(avgAttack).color }}>
                          {aoaLabel(avgAttack).text}
                        </p>
                      </div>
                    </div>
                    {!isEmpty && (
                      <div className={styles.value}>
                        <p style={{ color: aoaLabel(avgAttack).color }}>
                          {avgAttack.toFixed(1)}°
                        </p>
                      </div>
                    )}
                  </div>
                  <RangeBar
                    value={avgAttack}
                    min={-10}
                    max={10}
                    zones={[
                      { from: -10, to: -2, color: "var(--zone-bad)" },
                      { from: -2, to: 2, color: "var(--zone-okay)" },
                      { from: 2, to: 10, color: "var(--zone-good)" },
                    ]}
                  />
                  <div className={styles.labels}>
                    <p>Closed</p>
                    <p>Square</p>
                    <p>Open</p>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}

        {isEmpty && (
          <div className={styles.noData}>
            <FiActivity size={30} color="var(--lightgray)" />
            <p className={styles.title}>Swing and a miss</p>
            <p>
              Your swing metrics will appear here once you upload session data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwingMetricsWidget;
