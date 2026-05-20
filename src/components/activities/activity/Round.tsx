import ActivityStatWidget from "@/components/widgets/activity-stat-widget/ActivityStatWidget";
import styles from "./Activity.module.scss";
import moment from "moment";
import HoleByHoleWidget from "@/components/widgets/hole-by-hole-widget/HoleByHoleWidget";
import { useRound } from "@/hooks/useRound";
import RoundSummaryWidget from "@/components/widgets/round-summary-widget/RoundSummaryWidget";
import ScoringDistributionWidget from "@/components/widgets/scoring-distribution-widget/ScoringDistributionWidget";

type RoundProps = {
  activityData: any;
};

const Round = ({ activityData }: RoundProps) => {
  const activity = useRound({ activity: activityData });
  // console.log("Round activity data:", activityData);
  const {
    scores,
    frontScore,
    frontOverPar,
    frontPar,
    backScore,
    backPar,
    backOverPar,
  } = activity;

  const {
    course_name,
    session_name,
    round_begin,
    tee_type,
    slope,
    rating,
    total,
    hole_count,
    round_holes,
  } = activityData || {};

  return (
    <>
      <div className={styles.title}>
        <h1>{course_name}</h1>
        <div className={styles.info}>
          <p>
            {moment(round_begin).format("MMMM DD YYYY")} · {tee_type} tees ·
            Rating {rating} · Slope {slope}
          </p>
        </div>
        <div className={styles.score}>
          <p>{total}</p>
          {/* <span>{formatOverPar((Number(activity.total) - activity.par))} vs {activity.par}</span> */}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.column}>
          <div className={styles.row}>
            <ActivityStatWidget
              title="Fairways Hit"
              value={scores?.fairways_value_percent}
              metric="%"
              subText={`${scores?.fairways_value} / ${scores?.fairways_target}`}
            />
            <ActivityStatWidget
              title="Greens Hit"
              value={scores?.greens_value_percent}
              metric="%"
              subText={`${scores?.greens_value} / ${scores?.greens_target}`}
            />
            <ActivityStatWidget
              title="Sand Saves"
              value={scores?.sand_saves_value_percent}
              metric="%"
              subText={`${scores?.sand_saves_value} / ${scores?.sand_saves_target}`}
            />
            <ActivityStatWidget
              title="Putts"
              value={scores?.putts_value}
              subText={`Target ${scores?.putts_target}`}
            />
            <ActivityStatWidget
              title="Putts / Hole"
              value={(scores?.putts_value / round_holes.length).toFixed(2)}
              subText={`Average`}
            />
            <ActivityStatWidget
              title="Longest Drive"
              value={scores?.driving_distance_longest.toFixed(1)}
              subText={"yards"}
            />
          </div>
          <div className={styles.row}>
            <HoleByHoleWidget roundHoles={round_holes} />
          </div>
          <div className={styles.row}>
            <ScoringDistributionWidget rounds={[activityData]} />
          </div>
        </div>
        
        <div className={styles.column}>
          <div className={styles.row}>
            <RoundSummaryWidget activity={activity} roundHoles={round_holes} />
          </div>
        </div>

        {/* <div className={styles.row}>
          <ActivityStatWidget
            title="Bogey Avoidance"
            value={`${(((scores?.bogey + scores?.double_bogey) / round_holes.length) * 100).toFixed(0)}%`}
            subText={`${(scores?.bogey + scores?.double_bogey)} of ${round_holes.length} holes`}
          />
          <ActivityStatWidget
            title="Birdies vs Bogeys"
            value={`${scores?.birdie}B / ${(scores?.bogey + scores?.double_bogey)}B+`}
            subText={
              scores?.birdies > scores?.bogey ? "More birdies" : "More bogies"
            }
          />
        </div> */}
        {/* <div className={styles.fullRow}>
          <HoleByHoleWidget roundHoles={round_holes} />
        </div>
        <div className={styles.row}>
          <div className={styles.chart}>Coming soon</div>
          <div className={styles.chart}>Coming soon</div>
        </div> */}

        {/* <div className={styles.row}></div> */}
      </div>
    </>
  );
};

export default Round;
