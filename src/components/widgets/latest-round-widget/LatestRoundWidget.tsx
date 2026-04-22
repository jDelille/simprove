"use client";

import moment from "moment";
import styles from "./LatestRoundWidget.module.scss";
import Link from "next/link";

type LatestRoundWidget = {
  latestRound: any;
};

const LatestRoundWidget = ({ latestRound }: LatestRoundWidget) => {
  const scores = latestRound.round_scores[0];

  return (
    <div className={styles.latestRoundWidget}>
      <div className={styles.header}>
        <p>Latest Round</p>
      </div>
      <div className={styles.content}>
        <p className={styles.name}>
          {latestRound.course_name}{" "}
          <span>{moment(latestRound.round_begin).format("MMM DD")}</span>
        </p>
        <p className={styles.details}>
          {latestRound.tee_type} tees · {latestRound.hole_count} holes · Par{" "}
          {latestRound.par}
        </p>
        <Link href={`/rounds/${latestRound.round_key}`} className={styles.link}>View round</Link>
      </div>
    </div>
  );
};

export default LatestRoundWidget;
