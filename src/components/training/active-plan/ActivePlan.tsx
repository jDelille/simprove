"use client";

import React, { useState } from "react";
import styles from "./ActivePlan.module.scss";
import { Lesson } from "@/types/lesson";
import { useLessonDrills } from "@/hooks/useLessonDrills";
import DrillCard from "../drill-card/DrillCard";

type ActivePlanProps = {
  lesson: any;
};

const ActivePlan: React.FC<ActivePlanProps> = ({ lesson }) => {
  const lessonDetails = lesson?.lessonDetails;
  const lessonDrills = lesson?.drills;

  return (
    <div className={styles.activePlan}>
      <div className={styles.badges}>
        <div className={styles.badge}>Active Plan</div>
        <div className={styles.badge}>{lessonDetails?.type}</div>
      </div>
      <div className={styles.header}>
        <p className={styles.name}>{lessonDetails.lesson_name}</p>
        <p className={styles.description}>{lessonDetails?.lesson_description}</p>
      </div>

      <div className={styles.duration}>
        <p>Drill 1 of {lessonDrills?.length}</p>
      </div>

      <div className={styles.drills}>
        {lessonDrills?.map((drill: any) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>
    </div>
  );
};

export default ActivePlan;
