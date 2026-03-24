"use client";

import React from "react";
import styles from "./LessonPlanWidget.module.scss";
import Link from "next/link";
import { useActiveLessonPlan } from "@/hooks/useActiveLessonPlan";
import { useLessonDrills } from "@/hooks/useLessonDrills";

type LessonPlanWidgetProps = {};

const LessonPlanWidget: React.FC<LessonPlanWidgetProps> = () => {

  const {data: activeLessonPlan, isLoading, error} = useActiveLessonPlan();

  console.log(activeLessonPlan);

   const {
      data: lessonDrills,
      isLoading: drillsLoading,
      error: drillsError,
    } = useLessonDrills(activeLessonPlan?.[0].id);

  return (
    <div className={styles.widget}>
        <div className={styles.header}>
            <p>Lesson Plan</p>
        </div>
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div className={styles.progress}></div>
        </div>
        <div className={styles.value}>0% complete</div>
      </div>
      <div className={styles.content}>
        <ul>
          <li>
            <div className={styles.lesson}>
              <div className={styles.title}>
                <h3>{activeLessonPlan?.[0].lesson_name}</h3>
              </div>
              <div className={styles.description}>
                {activeLessonPlan?.[0].lesson_description}
              </div>
              <div className={styles.drills}>
                <div className={styles.drill}>
                  <div className={styles.circle}></div>
                  <p>{lessonDrills?.[0].drill_description}</p>
                </div>
              </div>
              <div className={styles.lessonInfo}>
                <div className={styles.link}>
                  <Link href="/lesson">View Lesson</Link>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LessonPlanWidget;
