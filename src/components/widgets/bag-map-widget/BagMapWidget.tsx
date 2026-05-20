import React, { useMemo } from "react";
import styles from "./BagMapWidget.module.scss";
import { RiBarChart2Fill } from "react-icons/ri";
import NoDataPlaceholderWidget from "@/components/ui/no-data-placeholder-widget/NoDataPlaceholderWidget";
import { Shot } from "@/types";

type BagMapWidgetProps = {
  shots: Shot[];
};

type ClubStat = {
  club: string;
  min: number;
  max: number;
  avg: number;
  spread: number;
  shotCount: number;
};

const CLUB_ORDER = [
  "DR",
  "W3",
  "W5",
  "H3",
  "H4",
  "I3",
  "I4",
  "I5",
  "I6",
  "I7",
  "I8",
  "I9",
  "PW",
  "GW",
  "SW",
  "LW",
];

const IDEAL_GAP_MIN = 10;
const IDEAL_GAP_MAX = 15;

// Per-category spread thresholds (yards) — longer clubs get more tolerance
const SPREAD_THRESHOLDS: Record<string, { tight: number; loose: number }> = {
  driver: { tight: 20, loose: 35 },
  woods: { tight: 18, loose: 30 },
  hybrids: { tight: 16, loose: 26 },
  long: { tight: 14, loose: 22 },
  mid: { tight: 12, loose: 18 },
  short: { tight: 10, loose: 14 },
};

const getClubCategory = (club: string): string => {
  if (club === "DR") return "driver";
  if (club.startsWith("W")) return "woods";
  if (club.startsWith("H")) return "hybrids";
  if (["I3", "I4", "I5"].includes(club)) return "long";
  if (["I6", "I7", "I8"].includes(club)) return "mid";
  return "short";
};

const getSpreadColor = (spread: number, club: string): string => {
  const { tight, loose } = SPREAD_THRESHOLDS[getClubCategory(club)];
  if (spread <= tight) return "var(--color-green, #4ade80)";
  if (spread <= loose) return "var(--color-yellow, #f59e0b)";
  return "var(--color-red, #f87171)";
};

const getSpreadLabel = (spread: number, club: string): string => {
  const { tight, loose } = SPREAD_THRESHOLDS[getClubCategory(club)];
  if (spread <= tight) return "Tight";
  if (spread <= loose) return "Moderate";
  return "Loose";
};

const getGapColor = (gap: number): string => {
  if (gap >= IDEAL_GAP_MIN && gap <= IDEAL_GAP_MAX)
    return "var(--color-green, #4ade80)";
  if (gap < IDEAL_GAP_MIN) return "var(--color-yellow, #f59e0b)";
  return "var(--color-blue, #60a5fa)";
};

const aggregateClubs = (shots: Shot[]): ClubStat[] => {
  const map = new Map<string, number[]>();

  shots.forEach((shot) => {
    if (!map.has(shot.club)) map.set(shot.club, []);
    map.get(shot.club)!.push(shot.carry);
  });

  const stats: ClubStat[] = [];
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

const BagMapWidget = ({ shots }: BagMapWidgetProps) => {
  const hasNoData = !shots || shots.length === 0;

  const clubStats = useMemo(() => aggregateClubs(shots ?? []), [shots]);

  if (hasNoData) {
    return (
      <div className={styles.bagMapWidget} id="bag-map">
        <div className={styles.header}>
          <p>Bag Map</p>
        </div>
        <div className={styles.content}>
          <NoDataPlaceholderWidget
            icon={<RiBarChart2Fill size={30} color="var(--lightgray)" />}
            title="No shot data"
            message="Your bag map will appear here once you've hit shots with multiple clubs."
          />
        </div>
      </div>
    );
  }

  const globalMin = Math.min(...clubStats.map((c) => c.min)) * 0.93;
  const globalMax = Math.max(...clubStats.map((c) => c.max)) * 1.04;
  const globalRange = globalMax - globalMin;

  return (
    <div className={styles.bagMapWidget} id="bag-map">
      <div className={styles.header}>
        <p>Bag Map</p>
        <span className={styles.headerSub}>
          Band width = carry spread · tick = avg
        </span>
      </div>

      <div className={styles.content}>
        {clubStats.map((stat, i) => {
          const spreadColor = getSpreadColor(stat.spread, stat.club);
          const spreadLabel = getSpreadLabel(stat.spread, stat.club);

          const leftPct = ((stat.min - globalMin) / globalRange) * 100;
          const widthPct = ((stat.max - stat.min) / globalRange) * 100;
          const avgPct = ((stat.avg - globalMin) / globalRange) * 100;

          const next = clubStats[i + 1] ?? null;
          const gap = next ? Math.round((stat.avg - next.avg) * 10) / 10 : null;
          const gapColor = gap !== null ? getGapColor(gap) : "transparent";
          const gapWarning = gap !== null && gap < IDEAL_GAP_MIN;
          const gapWide = gap !== null && gap > IDEAL_GAP_MAX;

          return (
            <React.Fragment key={stat.club}>
              {/* Club row */}
              <div className={styles.row}>
                <span className={styles.clubName}>{stat.club}</span>

                <div
                  className={styles.track}
                  title={`${stat.club}: ${stat.min}–${stat.max} yds · avg ${stat.avg} · spread ±${(stat.spread / 2).toFixed(0)} yds`}
                >
                  <div
                    className={styles.rangeBand}
                    style={{
                      left: `${leftPct}%`,
                      width: `${widthPct}%`,
                      borderColor: spreadColor,
                      backgroundColor: `${spreadColor.replace("var(--color-green, ", "").replace("var(--color-yellow, ", "").replace("var(--color-red, ", "").replace(")", "")}22`,
                    }}
                  />
                  <div
                    className={styles.avgTick}
                    style={{
                      left: `calc(${avgPct}% - 1px)`,
                      backgroundColor: spreadColor,
                    }}
                  />
                </div>

                <div className={styles.avgValue}>
                  {stat.avg} <span className={styles.unit}>yds</span>
                </div>

                <div
                  className={styles.spreadValue}
                  style={{ color: spreadColor }}
                >
                  ±{(stat.spread / 2).toFixed(0)}{" "}
                </div>
              </div>

              {/* Gap divider between clubs */}
              {gap !== null && (
                <div className={styles.gapDivider}>
                  <div className={styles.gapLine} />
                  <div
                    className={styles.gapPill}
                    style={{ color: gapColor, borderColor: gapColor }}
                  >
                    ↓ {gap} yds{gapWarning ? " ⚠" : gapWide ? " ↑" : ""}
                  </div>
                  <div className={styles.gapLine} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span style={{ color: "var(--accent)" }}>● Tight contact</span>
        <span style={{ color: "var(--bogey)" }}>● Moderate</span>
        <span style={{ color: "var(--doubleBogey)" }}>● Loose contact</span>
        <span className={styles.legendRight}>
          <span style={{ color: "var(--accent)" }}>↓ Ideal gap</span>
          <span style={{ color: "var(--bogey)" }}>⚠ Too tight</span>
          <span style={{ color: "var(--doubleBogey)" }}>↑ Wide</span>
        </span>
      </div>
    </div>
  );
};

export default BagMapWidget;
