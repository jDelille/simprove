import React from "react";
import styles from "./FaceAngleWidget.module.scss";
import { Averages } from "@/lib/shots/averages";

type FaceAngleWidgetProps = {
  clubAverages?: Record<string, Averages>;
};

const FaceAngleWidget: React.FC<FaceAngleWidgetProps> = ({ clubAverages }) => {
  const range = 4;

  if (!clubAverages || Object.keys(clubAverages).length === 0) {
    return <div>No data</div>;
  }

  const clubs = Object.entries(clubAverages).map(([club, stats]) => {
    const face = stats.avgfaceToTarget ?? 0;
    const pct = 50 + (Math.max(-range, Math.min(range, face)) / range) * 46;
    const isOpen = face > 0.15;
    const isClosed = face < -0.15;
    const dotColor = isOpen
      ? "#facd39"
      : isClosed
        ? "#0258b5"
        : "var(--accent)";

    return { club, face, pct, dotColor };
  });

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Face Angle</p>
      </div>
      <div className={styles.labels}>
        <ul>
          <li className={styles.label}>Closed</li>
          <li className={styles.label}>Square</li>
          <li className={styles.label}>Open</li>
        </ul>
      </div>

      <div className={styles.body}>
        <ul className={styles.clubs}>
          {clubs.map(({ club, face, pct, dotColor }) => (
            <li key={club}>
              <span className={styles.clubName}>{club}</span>
              <div className={styles.bar}>
                <div className={styles.centerLine} />
                <div
                  className={styles.dot}
                  style={{
                    left: `${pct}%`,
                    border: `2px solid ${dotColor}`,
                    background: dotColor,
                  }}
                />
              </div>
              <span className={styles.value} style={{ color: dotColor }}>
                {face > 0 ? "+" : ""}
                {face.toFixed(2)}°
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FaceAngleWidget;
