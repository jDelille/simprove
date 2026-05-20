import React from "react";
import styles from "./ClubGappingWidget.module.scss";
import { RiBarChart2Fill } from "react-icons/ri";
import NoDataPlaceholderWidget from "@/components/ui/no-data-placeholder-widget/NoDataPlaceholderWidget";
import { Shot } from "@/types";

type ClubGappingWidgetProps = {
  shots: Shot[];
};

type ClubStat = {
  club: string;
  avgCarry: number;
  shotCount: number;
};

const IDEAL_GAP_MIN = 10;
const IDEAL_GAP_MAX = 15;

// Preferred display order: longest to shortest
const CLUB_ORDER = [
  "DR", "W3", "W5", "H3", "H4",
  "I3", "I4", "I5", "I6", "I7", "I8", "I9",
  "PW", "GW", "SW", "LW",
];

const getGapColor = (gap: number | null): string => {
  if (gap === null) return "transparent";
  if (gap >= IDEAL_GAP_MIN && gap <= IDEAL_GAP_MAX) return "#4ade80";
  if (gap < IDEAL_GAP_MIN) return "#f59e0b";
  return "#60a5fa";
};

const aggregateClubs = (shots: Shot[]): ClubStat[] => {
  const map = new Map<string, number[]>();

  shots.forEach((shot) => {
    if (!map.has(shot.club)) map.set(shot.club, []);
    map.get(shot.club)!.push(shot.carry);
  });

  const stats: ClubStat[] = [];
  map.forEach((carries, club) => {
    const avgCarry = carries.reduce((a, b) => a + b, 0) / carries.length;
    stats.push({
      club,
      avgCarry: Math.round(avgCarry * 10) / 10,
      shotCount: carries.length,
    });
  });

  // Sort by CLUB_ORDER; unknown clubs fall to end sorted by carry desc
  return stats.sort((a, b) => {
    const ai = CLUB_ORDER.indexOf(a.club);
    const bi = CLUB_ORDER.indexOf(b.club);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return b.avgCarry - a.avgCarry;
  });
};

const ClubGappingWidget = ({ shots }: ClubGappingWidgetProps) => {
  const hasNoData = !shots || shots.length === 0;

  if (hasNoData) {
    return (
      <div className={styles.clubGappingWidget} id="club-gapping">
        <div className={styles.header}>
          <p>Club Gapping</p>
        </div>
        <div className={styles.content}>
          <NoDataPlaceholderWidget
            icon={<RiBarChart2Fill size={30} color="var(--lightgray)" />}
            title="No shot data"
            message="Club gapping will appear here once you've hit shots with multiple clubs."
          />
        </div>
      </div>
    );
  }

  const clubStats = aggregateClubs(shots);
  const maxCarry = clubStats[0]?.avgCarry ?? 1; // first item is longest after sort

  return (
    <div className={styles.clubGappingWidget} id="club-gapping">
      <div className={styles.header}>
        <p>Club Gapping</p>
      </div>

      <div className={styles.content}>
        {clubStats.map((stat, i) => {
          const next = clubStats[i + 1] ?? null;
          const gap = next
            ? Math.round((stat.avgCarry - next.avgCarry) * 10) / 10
            : null;
          const gapColor = getGapColor(gap);
          const percent = (stat.avgCarry / maxCarry) * 100;

          return (
            <div key={stat.club} className={styles.category}>
              <p className={styles.clubName}>{stat.club}</p>

              <div className={styles.bar}>
                <div
                  className={styles.fill}
                  style={{ width: `${percent}%`, backgroundColor: "var(--accent)" }}
                />
              </div>

              <div className={styles.value}>
                {stat.avgCarry}{" "}
                <span className={styles.unit}>yds</span>
              </div>

              <div
                className={styles.gap}
                style={{ color: gapColor }}
                title={
                  gap === null
                    ? "Shortest club in bag"
                    : gap < IDEAL_GAP_MIN
                    ? `${gap} yds — tighter than ideal (${IDEAL_GAP_MIN}–${IDEAL_GAP_MAX} yds)`
                    : `${gap} yds to next club`
                }
              >
                {gap !== null ? (
                  <>↓{gap} yds{gap < IDEAL_GAP_MIN ? " ⚠" : ""}</>
                ) : (
                  <span className={styles.gapEmpty}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span style={{ color: "#4ade80" }}>
          ● {IDEAL_GAP_MIN}–{IDEAL_GAP_MAX} yds ideal
        </span>
        <span style={{ color: "#f59e0b" }}>● Too tight ⚠</span>
        <span style={{ color: "#60a5fa" }}>● Wide gap</span>
      </div>
    </div>
  );
};

export default ClubGappingWidget;
