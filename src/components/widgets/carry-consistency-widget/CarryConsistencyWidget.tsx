import React, { useMemo } from "react";
import styles from "./CarryConsistencyWidget.module.scss";
import { RiBarChart2Fill } from "react-icons/ri";
import NoDataPlaceholderWidget from "@/components/ui/no-data-placeholder-widget/NoDataPlaceholderWidget";
import { Shot } from "@/types";

type CarryConsistencyWidgetProps = {
  shots: Shot[];
};

type ClubConsistency = {
  club: string;
  min: number;
  max: number;
  avg: number;
  spread: number; // max - min
  shotCount: number;
};

// Acceptable spread thresholds per club category (yards)
// Longer clubs naturally have more variance
const SPREAD_THRESHOLDS = {
  tight: { driver: 20, woods: 18, hybrids: 16, long: 14, mid: 12, short: 10 },
  loose: { driver: 35, woods: 30, hybrids: 26, long: 22, mid: 18, short: 14 },
};

const CLUB_ORDER = [
  "DR", "W3", "W5", "H3", "H4",
  "I3", "I4", "I5", "I6", "I7", "I8", "I9",
  "PW", "GW", "SW", "LW",
];

const getClubCategory = (club: string) => {
  if (club === "DR") return "driver";
  if (club.startsWith("W")) return "woods";
  if (club.startsWith("H")) return "hybrids";
  if (["I3", "I4", "I5"].includes(club)) return "long";
  if (["I6", "I7", "I8"].includes(club)) return "mid";
  return "short"; // I9, PW, GW, SW, LW
};

const getSpreadColor = (spread: number, club: string): string => {
  const cat = getClubCategory(club);
  const tight = SPREAD_THRESHOLDS.tight[cat];
  const loose = SPREAD_THRESHOLDS.loose[cat];
  if (spread <= tight) return "#4ade80";  // tight — great contact
  if (spread <= loose) return "#f59e0b";  // moderate variance
  return "#f87171";                        // too loose
};

const getSpreadLabel = (spread: number, club: string): string => {
  const cat = getClubCategory(club);
  const tight = SPREAD_THRESHOLDS.tight[cat];
  const loose = SPREAD_THRESHOLDS.loose[cat];
  if (spread <= tight) return "Tight";
  if (spread <= loose) return "Moderate";
  return "Loose";
};

const aggregateConsistency = (shots: Shot[]): ClubConsistency[] => {
  const map = new Map<string, number[]>();

  shots.forEach((shot) => {
    if (!map.has(shot.club)) map.set(shot.club, []);
    map.get(shot.club)!.push(shot.carry);
  });

  const stats: ClubConsistency[] = [];
  map.forEach((carries, club) => {
    const min = Math.min(...carries);
    const max = Math.max(...carries);
    const avg = carries.reduce((a, b) => a + b, 0) / carries.length;
    stats.push({
      club,
      min: Math.round(min * 10) / 10,
      max: Math.round(max * 10) / 10,
      avg: Math.round(avg * 10) / 10,
      spread: Math.round((max - min) * 10) / 10,
      shotCount: carries.length,
    });
  });

  return stats.sort((a, b) => {
    const ai = CLUB_ORDER.indexOf(a.club);
    const bi = CLUB_ORDER.indexOf(b.club);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return b.avg - a.avg;
  });
};

const CarryConsistencyWidget = ({ shots }: CarryConsistencyWidgetProps) => {
  const hasNoData = !shots || shots.length === 0;

  const clubStats = useMemo(() => aggregateConsistency(shots ?? []), [shots]);

  if (hasNoData) {
    return (
      <div className={styles.carryConsistencyWidget} id="carry-consistency">
        <div className={styles.header}>
          <p>Carry Consistency</p>
        </div>
        <div className={styles.content}>
          <NoDataPlaceholderWidget
            icon={<RiBarChart2Fill size={30} color="var(--lightgray)" />}
            title="No shot data"
            message="Carry consistency will appear here once you've hit shots with multiple clubs."
          />
        </div>
      </div>
    );
  }

  // Global min/max across all clubs for positioning the range track
  const globalMin = Math.min(...clubStats.map((c) => c.min)) * 0.95;
  const globalMax = Math.max(...clubStats.map((c) => c.max)) * 1.02;
  const globalRange = globalMax - globalMin;

  return (
    <div className={styles.carryConsistencyWidget} id="carry-consistency">
      <div className={styles.header}>
        <p>Carry Consistency</p>
      </div>

      <div className={styles.content}>
        {clubStats.map((stat) => {
          const spreadColor = getSpreadColor(stat.spread, stat.club);
          const spreadLabel = getSpreadLabel(stat.spread, stat.club);

          // Position the filled range on the track relative to global min/max
          const leftPct = ((stat.min - globalMin) / globalRange) * 100;
          const widthPct = ((stat.max - stat.min) / globalRange) * 100;
          const avgPct = ((stat.avg - globalMin) / globalRange) * 100;

          return (
            <div key={stat.club} className={styles.category}>
              <p className={styles.clubName}>{stat.club}</p>

              <div
                className={styles.bar}
                title={`Min: ${stat.min} yds · Avg: ${stat.avg} yds · Max: ${stat.max} yds`}
              >
                {/* Range band */}
                <div
                  className={styles.rangeFill}
                  style={{
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    borderColor: spreadColor,
                    backgroundColor: `${spreadColor}22`,
                  }}
                />
                {/* Avg tick */}
                <div
                  className={styles.avgTick}
                  style={{
                    left: `calc(${avgPct}% - 1px)`,
                    backgroundColor: spreadColor,
                  }}
                />
              </div>

              <div className={styles.value}>
                {stat.avg} <span className={styles.unit}>yds</span>
              </div>

              <div
                className={styles.spreadLabel}
                style={{ color: spreadColor }}
                title={`±${(stat.spread / 2).toFixed(1)} yds from avg · spread: ${stat.spread} yds`}
              >
                ±{(stat.spread / 2).toFixed(0)}{" "}
                {/* <span className={styles.spreadTag}>{spreadLabel}</span> */}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span style={{ color: "#4ade80" }}>● Tight</span>
        <span style={{ color: "#f59e0b" }}>● Moderate</span>
        <span style={{ color: "#f87171" }}>● Loose</span>
      </div>
    </div>
  );
};

export default CarryConsistencyWidget;
