import React from "react";
import styles from "./ScoringDistributionWidget.module.scss";
import { Round } from "@/types/round";
import Button from "@/components/ui/button/Button";
import { RiBarChart2Fill } from "react-icons/ri";

type ScoringDistributionWidgetProps = {
  rounds: Round[];
};

const ScoringDistributionWidget = ({
  rounds,
}: ScoringDistributionWidgetProps) => {
  const scoringCategories = [
    "Eagle",
    "Birdie",
    "Par",
    "Bogey",
    "Double",
    "Triple+",
  ];

  const hasNoRounds = rounds.length === 0;

  if (hasNoRounds) {
    return (
      <div className={styles.scoringDistributionWidget} id="scoring-distribution">
        <div className={styles.header}>
          <p>Scoring Distribution</p>
        </div>
        <div className={styles.content}>
          <div className={styles.noData}>
            <RiBarChart2Fill color="var(--lightgray)" size={30}/>

            <p className={styles.title}>Your scoring distribution is waiting</p>
            <p>Upload a round to see how your scores break down across the board.</p>
          </div>
        </div>
      </div>
    );
  }

  const scores = rounds.map((r) => r.round_scores?.[0]).filter(Boolean);

  const totalShots = scores.reduce((sum, s) => {
    return (
      sum + s.eagle + s.birdie + s.par + s.bogey + s.double_bogey + s.other
    );
  }, 0);

  const distribution = {
    Eagle: scores.reduce((sum, s) => sum + s.eagle, 0),
    Birdie: scores.reduce((sum, s) => sum + s.birdie, 0),
    Par: scores.reduce((sum, s) => sum + s.par, 0),
    Bogey: scores.reduce((sum, s) => sum + s.bogey, 0),
    Double: scores.reduce((sum, s) => sum + s.double_bogey, 0),
    "Triple+": scores.reduce((sum, s) => sum + s.other, 0),
  };

  const getPercent = (value: number): number => {
    return totalShots ? (value / totalShots) * 100 : 0;
  };

  const scoringColors: Record<string, string> = {
  Eagle: "#22c55e",      // green (elite)
  Birdie: "#4ade80",     // light green
  Par: "#60a5fa",        // blue (neutral / expected)
  Bogey: "#f59e0b",      // amber
  Double: "#f97316",     // orange
  "Triple+": "#ef4444",  // red (bad)
};
  return (
    <div className={styles.scoringDistributionWidget} id="scoring-distribution">
      <div className={styles.header}>
        <p>Scoring Distribution</p>
      </div>

      <div className={styles.content}>
        {scoringCategories.map((category) => {
          const value = distribution[category as keyof typeof distribution];
          const percent = getPercent(value);

          return (
            <div key={category} className={styles.category}>
              <p>{category}</p>

              <div className={styles.bar}>
                <div className={styles.fill} style={{ width: `${percent}%`, backgroundColor: scoringColors[category] }} />
              </div>

              <div className={styles.value}>{value}</div>
              <div className={styles.percentage}>{Math.round(percent)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoringDistributionWidget;
