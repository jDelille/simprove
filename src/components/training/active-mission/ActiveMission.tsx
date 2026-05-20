"use client";

import React from "react";
import styles from "./ActiveMission.module.scss";
import DrillCard from "../drill-card/DrillCard";
import { ActiveLesson } from "@/types/activeLesson";

type ActiveMissionProps = {
  lesson: ActiveLesson | null;
};

const ActiveMission: React.FC<ActiveMissionProps> = ({ lesson }) => {

  const lessonDetails = lesson?.lessonDetails;
  const lessonDrills = lesson?.drills;

  return (
    <div className={styles.activePlan}>
      <div className={styles.badges}>
        <div className={styles.badge}>Active Plan</div>
        <div className={styles.badge}>{lessonDetails?.type}</div>
      </div>
      {/* <div className={styles.settings}>
        <button>edit</button>
      </div> */}
      <div className={styles.header}>
        <p className={styles.name}>{lessonDetails.lesson_name}</p>
        <p className={styles.description}>{lessonDetails?.lesson_description}</p>
      </div>

      <div className={styles.duration}>
        <div className={styles.labels}>
          <p>Drill progress</p>
          <p>0 / {lessonDrills?.length} complete</p>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "1%" }}></div>
        </div>
      </div>

      <div className={styles.drills}>
        {lessonDrills?.map((drill: any) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>
    </div>
  );
};

export default ActiveMission;
