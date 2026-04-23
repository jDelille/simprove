"use client";

import { FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import moment from "moment";
import ActivityStatWidget from "../widgets/activity-stat-widget/ActivityStatWidget";
import styles from "./Activity.module.scss";

type ActivityProps = {
  activity: any;
};
const Activity = ({ activity }: ActivityProps) => {
  console.log("activity: ", activity);
  const router = useRouter();

  const scores = activity.round_scores?.[0] || null;

  const front9 = activity.round_holes.filter(
    (h: any) => h.hole_number >= 1 && h.hole_number <= 9,
  );

  const frontStrokes = front9.reduce(
    (sum: number, h: any) => sum + (h.strokes ?? 0),
    0,
  );
  const frontPar = front9.reduce(
    (sum: number, h: any) => sum + (h.par ?? 0),
    0,
  );
  const frontScore = front9.reduce(
    (sum: number, h: any) => sum + (h.strokes ?? 0),
    0,
  );
  const frontOverPar = frontStrokes - frontPar;

  const back9 = activity.round_holes.filter(
    (h: any) => h.hole_number >= 10 && h.hole_number <= 18,
  );

  const backStrokes = back9.reduce(
    (sum: number, h: any) => sum + (h.strokes ?? 0),
    0,
  );
  const backPar = back9.reduce((sum: number, h: any) => sum + (h.par ?? 0), 0);

  const backScore = back9.reduce(
    (sum: number, h: any) => sum + (h.strokes ?? 0),
    0,
  );
  const backOverPar = backStrokes - backPar;

  const formatOverPar = (val: number) => {
    if (val > 0) return `+${val}`;
    if (val < 0) return `${val}`;
    return "E";
  };

  return (
    <div className={styles.activity}>
      <div className={styles.pageHeader}>
        <div className={styles.backBtn}>
          <button onClick={() => router.push("/activities")}>Activities</button>{" "}
          <FaChevronRight size={8} /> {activity.course_name}
        </div>
        <div className={styles.title}>
          <h1>{activity.course_name || activity.session_name}</h1>
          <div className={styles.info}>
            <p>
              {moment(activity.round_begin).format("MMMM DD YYYY")} ·{" "}
              {activity.tee_type} tees · Rating {activity.rating} · Slope{" "}
              {activity.slope}
            </p>
          </div>
          <div className={styles.score}>
            <p>{activity.total}</p>
            <span>{formatOverPar((Number(activity.total) - activity.par))} vs {activity.par}</span>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <ActivityStatWidget
            title="Fairways Hit"
            value={scores.fairways_value_percent}
            metric="%"
            subText={`${scores.fairways_value} / ${scores.fairways_target}`}
          />
          <ActivityStatWidget
            title="Greens Hit"
            value={scores.greens_value_percent}
            metric="%"
            subText={`${scores.greens_value} / ${scores.greens_target}`}
          />
          <ActivityStatWidget
            title="Sand Saves"
            value={scores.sand_saves_value_percent}
            metric="%"
            subText={`${scores.sand_saves_value} / ${scores.sand_saves_target}`}
          />
          <ActivityStatWidget
            title="Putts"
            value={scores.putts_value}
            subText={`Target ${scores.putts_target}`}
          />
          <ActivityStatWidget
            title="Putts / Hole"
            value={(scores.putts_value / activity.hole_count).toFixed(2)}
            subText={`Average`}
          />
          <ActivityStatWidget
            title="Longest Drive"
            value={scores.driving_distance_longest.toFixed(1)}
            subText={"yards"}
          />
        </div>
        <div className={styles.row}>
          <ActivityStatWidget
            title="Front 9"
            value={frontScore}
            subText={`${formatOverPar(frontOverPar)} · par ${frontPar}`}
          />
          <ActivityStatWidget
            title="Back 9"
            value={backScore}
            subText={`${formatOverPar(backOverPar)} · par ${backPar}`}
          />
          <ActivityStatWidget
            title="Bogey Avoidance"
            value={`${((scores.bogey / activity.hole_count) * 100).toFixed(0)}%`}
            subText={`${scores.bogey} of ${activity.hole_count} holes`}
          />
           <ActivityStatWidget
            title="Birdies vs Bogeys"
            value={`${scores.birdie}B / ${scores.bogey}B+`}
            subText={scores.birdies > scores.bogey ? "More birdies" : "More bogies"}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.chart}></div>
        </div>
        <div className={styles.row}>
          <div className={styles.chart}></div>
          <div className={styles.chart}></div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
