"use client";

import { FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Round from "./Round";
import Session from "./Session";
import styles from "./Activity.module.scss";

type ActivityProps = {
  activityData: any;
};
const Activity = ({ activityData }: ActivityProps) => {
  console.log("activity: ", activityData);
  const router = useRouter();

  const isRound = !!activityData.round_type;

  const { course_name, session_name } = activityData || {};

  return (
    <div className={styles.activity}>
      <div className={styles.pageHeader}>
        <div className={styles.backBtn}>
          <button onClick={() => router.push("/activities")}>Activities</button>{" "}
          <FaChevronRight size={8} /> {course_name || session_name}
        </div>
      </div>
      {isRound ? <Round activityData={activityData} /> : <Session activityData={activityData} />}
    </div>
  );
};

export default Activity;
