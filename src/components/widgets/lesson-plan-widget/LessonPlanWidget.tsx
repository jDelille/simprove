"use client";

import React from "react";
import styles from "./LessonPlanWidget.module.scss";
import Link from "next/link";
import { useLessonDrills } from "@/hooks/useLessonDrills";
import { useActivePlan } from "@/hooks/useActivePlan";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";

type LessonPlanWidgetProps = {
  userId: string;
};

const LessonPlanWidget: React.FC<LessonPlanWidgetProps> = ({ userId }) => {
  const { data: activeLesson } = useActivePlan(userId);
  const router = useRouter();

  const {
    data: lessonDrills,
    isLoading: drillsLoading,
    error: drillsError,
  } = useLessonDrills(activeLesson?.[0].id);

  const isEmpty = !activeLesson || activeLesson.length === 0;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Lesson Plan</p>
      </div>
      {!isEmpty && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progress}></div>
          </div>
          <div className={styles.value}>0% complete</div>
        </div>
      )}
      {!isEmpty && (
        <div className={styles.content}>
          <ul>
            <li>
              <div className={styles.lesson}>
                <div className={styles.title}>
                  <h3>{activeLesson?.[0].lesson_name}</h3>
                </div>
                <div className={styles.description}>
                  {activeLesson?.[0].lesson_description}
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
      )}
      {isEmpty && (
        <div className={styles.emptyMessage}>
          <p>Let's start training</p>
          <span>Choose one of our lesson plans to get started</span>
          <Button variant="lessonCard" children="Find a lesson" onClick={() => router.push("/training")}/>
        </div>
      )}
    </div>
  );
};

export default LessonPlanWidget;
