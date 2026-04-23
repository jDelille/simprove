"use client";

import { FaChevronRight } from "react-icons/fa";
import styles from "./Activity.module.scss";
import { useRouter } from "next/navigation";
import moment from "moment";
import { SmallStatWidget } from "../widgets";

type ActivityProps = {
  activity: any;
};
const Activity = ({ activity }: ActivityProps) => {
  console.log("activity: ", activity);
  const router = useRouter();
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
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.row}>
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
        </div>
        <div className={styles.row}>
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
          />
          <SmallStatWidget
            title="Fairways"
            metric="%"
            value={activity.round_scores?.[0].fairways_value_percent}
            trend={activity.round_scores?.[0].fairways_value}
            trendText={"11/14"}
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
