"use client";
 
import React from "react";
import styles from "./CalendarWidget.module.scss";
 
export type DayResult = {
  r: "W" | "L" | "P";
  u: number;
};
 
export type CalendarWidgetProps = {
  data?: Record<number, DayResult>;
  title?: string;
  totalUnits?: number;
  record?: string;
  totalBets?: number;
  daysInMonth?: number;
};
 
const DEMO_DATA: Record<number, DayResult> = {
  2:  { r: "W", u:  0.02 }, 3:  { r: "W", u:  0.03 }, 4:  { r: "W", u:  0.03 },
  5:  { r: "L", u: -0.06 }, 6:  { r: "W", u:  0.08 }, 7:  { r: "L", u: -0.17 },
  8:  { r: "W", u:  0.06 }, 9:  { r: "L", u: -0.15 }, 10: { r: "L", u: -0.46 },
  11: { r: "W", u:  0.06 }, 12: { r: "L", u: -0.35 }, 13: { r: "W", u:  0.25 },
  14: { r: "W", u:  0.06 }, 15: { r: "L", u: -0.07 }, 16: { r: "W", u:  0.24 },
  17: { r: "L", u: -0.58 }, 18: { r: "W", u:  0.02 }, 19: { r: "L", u: -0.18 },
  20: { r: "L", u: -0.14 }, 21: { r: "L", u: -0.01 }, 22: { r: "W", u:  0.07 },
  23: { r: "W", u:  0.02 }, 24: { r: "L", u: -0.02 }, 25: { r: "W", u:  0.03 },
  26: { r: "L", u: -0.26 }, 27: { r: "L", u: -0.02 }, 28: { r: "P", u:  0.00 },
  29: { r: "L", u: -0.14 }, 30: { r: "L", u: -0.04 },
};
 
function cellVariant(d: DayResult | undefined): "win" | "loss" | "push" | "empty" {
  if (!d) return "empty";
  if (d.r === "W") return "win";
  if (d.r === "L") return "loss";
  return "push";
}
 
const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  data = DEMO_DATA,
  title = "Last 30 Days",
  totalUnits = -1.63,
  record = "167-131-1",
  totalBets = 299,
  daysInMonth = 31,
}) => {
  const [activeTab, setActiveTab] = React.useState<"chart" | "calendar">("calendar");
 
  const isProfit = totalUnits >= 0;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
 
  return (
    <div className={styles.widget}>
      <div className={styles.topBar}>
        <div className={styles.titleRow}>
          <span className={styles.title}>{title}</span>
          <span className={styles.info}>ⓘ</span>
        </div>
        <div className={styles.tabs}>
          {(["chart", "calendar"] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
 
      <div className={styles.stats}>
        <div className={`${styles.totalUnits} ${isProfit ? styles.profit : styles.loss}`}>
          {isProfit ? "+" : ""}
          {totalUnits.toFixed(2)}u
        </div>
        <div className={styles.record}>
          {totalBets} Bets ({record})
        </div>
      </div>
 
      <div className={styles.grid}>
        {days.map((day) => {
          const entry = data[day];
          const variant = cellVariant(entry);
          return (
            <div key={day} className={`${styles.cell} ${styles[variant]}`}>
              <div className={styles.cellHeader}>
                <span className={styles.dayNum}>{day}</span>
                {entry && (
                  <span className={`${styles.badge} ${styles[`badge_${variant}`]}`}>
                    {entry.r}
                  </span>
                )}
              </div>
              <div className={styles.cellValue}>
                {entry ? `${Math.abs(entry.u).toFixed(2)}u` : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
 
export default CalendarWidget;
