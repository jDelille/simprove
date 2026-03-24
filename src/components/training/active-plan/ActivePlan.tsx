"use client";

import React, { useState } from "react";
import styles from "./ActivePlan.module.scss";
import { Lesson } from "@/types/lesson";
import { useLessonDrills } from "@/hooks/useLessonDrills";
import DrillCard from "../drill-card/DrillCard";

type ActivePlanProps = {
  lesson: Lesson;
};

const ActivePlan: React.FC<ActivePlanProps> = ({ lesson }) => {
  const {
    data: lessonDrills,
    isLoading: drillsLoading,
    error: drillsError,
  } = useLessonDrills(lesson?.id);

  if (drillsLoading)
    return <div className={styles.activePlan}>Loading drills...</div>;
  if (drillsError)
    return <div className={styles.activePlan}>Failed to load drills</div>;

  return (
    <div className={styles.activePlan}>
      <div className={styles.badges}>
        <div className={styles.badge}>Active Plan</div>
        <div className={styles.badge}>{lesson?.type}</div>
      </div>
      <div className={styles.header}>
        <p className={styles.name}>{lesson?.lesson_name}</p>
        <p className={styles.description}>{lesson?.lesson_description}</p>
      </div>

      <div className={styles.duration}>
        <p>Week 1 of {lesson?.weeks}</p>
      </div>

      <div className={styles.drills}>
        {lessonDrills?.map((drill) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>
    </div>
  );
};

export default ActivePlan;
