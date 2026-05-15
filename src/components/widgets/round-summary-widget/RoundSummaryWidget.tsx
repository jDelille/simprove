import React from "react";
import styles from "./RoundSummaryWidget.module.scss";

type GridCardProps = {
  label?: string;
  value?: string | number;
  metric?: string;
  color?: string;
};

const GridCard = ({ label, value, metric, color }: GridCardProps) => {
  return (
    <div className={styles.gridCard}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value} style={{ color }}>
        {value}
      </p>
      <span className={styles.metric}>{metric}</span>
    </div>
  );
};

const RoundSummaryWidget = ({
  activity,
  roundHoles,
}: {
  activity: any;
  roundHoles: any[];
}) => {
  console.log(roundHoles);
  const {
    scores,
    frontScore,
    frontOverPar,
    frontPar,
    backScore,
    backPar,
    backOverPar,
  } = activity;

  const bestHole = roundHoles.reduce((best, current) => {
    const currentScore = current.strokes - current.par;
    const bestScore = best.strokes - best.par;

    return currentScore < bestScore ? current : best;
  });

  const worstHole = roundHoles.reduce((worst, current) => {
    const currentScore = current.strokes - current.par;
    const worstScore = worst.strokes - worst.par;

    return currentScore > worstScore ? current : worst;
  });

  const getHoleLabel = (hole: any) => {
    const diff = hole.strokes - hole.par;

    let scoreName = "";

    if (diff === -3) scoreName = "Albatross";
    else if (diff === -2) scoreName = "Eagle";
    else if (diff === -1) scoreName = "Birdie";
    else if (diff === 0) scoreName = "Par";
    else if (diff === 1) scoreName = "Bogey";
    else if (diff === 2) scoreName = "Double";
    else if (diff === 3) scoreName = "Triple";
    else if (diff > 3) scoreName = `+${diff}`;
    else scoreName = `${diff}`;

    return `${scoreName} - Par ${hole.par}`;
  };

  const formatOverPar = (val: number) => {
    if (val > 0) return `+${val}`;
    if (val < 0) return `${val}`;
    return "E";
  };

  const birdieCount = roundHoles.filter(
    (hole) => hole.strokes - hole.par === -1,
  ).length;

  return (
    <div className={styles.roundSummaryWidget}>
      <div className={styles.header}>
        <p>Round Summary</p>
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          <GridCard
            label="Best Hole"
            value={`#${bestHole.hole_number}`}
            metric={getHoleLabel(bestHole)}
            color="var(--birdie)"
          />
          <GridCard
            label="Worst Hole"
            value={`#${worstHole.hole_number}`}
            metric={getHoleLabel(worstHole)}
            color="var(--doubleBogey)"
          />
          <GridCard
            label="Longest Drive"
            value={`${activity.scores.driving_distance_longest.toFixed(0)} yds`}
            metric="New Personal Best!"
          />
          <GridCard
            label="Birdies"
            value={birdieCount.toString()}
            metric="Total Birdies"
          />
        </div>

        <div className={styles.scores}>
          <GridCard
            label="Front 9"
            value={frontScore}
            metric={`${formatOverPar(frontOverPar)} vs par ${frontPar}`}
          />
          <GridCard
            label="Back 9"
            value={backScore}
            metric={`${formatOverPar(backOverPar)} vs par ${backPar}`}
            color="var(--overPar)"
          />
        </div>
      </div>
    </div>
  );
};

export default RoundSummaryWidget;
