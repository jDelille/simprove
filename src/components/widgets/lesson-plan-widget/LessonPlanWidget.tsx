"use client";

import React from "react";
import styles from "./LessonPlanWidget.module.scss";
import Link from "next/link";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";
import { ActiveLesson } from "@/types/activeLesson";

type LessonPlanWidgetProps = {
  userId: string;
  activeLesson?: ActiveLesson;
};

const LessonPlanWidget: React.FC<LessonPlanWidgetProps> = ({
  userId,
  activeLesson,
}) => {
  const router = useRouter();

  const lessonDetails = activeLesson?.lessonDetails;
  const lessonDrills = activeLesson?.drills;
  const isEmpty = !activeLesson || activeLesson.activeLesson === null;

  const lessonProgress = activeLesson?.summary
    ? activeLesson.summary.total > 0
      ? (activeLesson.summary.completed / activeLesson.summary.total) * 100
      : 0
    : 0;

  const drillClass = (drillStatus: string) => {
    switch (drillStatus) {
      case "active":
        return styles.active;
      case "completed":
        return styles.completed;
      default:
        return styles.inactive;
    }
  };

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Lesson Plan</p>
      </div>
      {!isEmpty && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progress}
              style={{ width: `${lessonProgress}%` }}
            ></div>
          </div>
          <div className={styles.value}>
            {lessonProgress.toFixed(0)}% complete
          </div>
        </div>
      )}
      {!isEmpty && (
        <div className={styles.content}>
          <ul>
            <li>
              <div className={styles.lesson}>
                <div className={styles.title}>
                  <h3>{lessonDetails?.lesson_name}</h3>
                </div>
                <div className={styles.description}>
                  {lessonDetails?.lesson_description}
                </div>
                <div className={styles.drills}>
                  {lessonDrills?.map((drill: any) => (
                    <div className={styles.drill} key={drill.id}>
                      <div className={drillClass(drill.status)}></div>
                      <p>{drill.drill_description}</p>
                    </div>
                  ))}
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
          <Button
            variant="lessonCard"
            children="Find a lesson"
            onClick={() => router.push("/training")}
          />
        </div>
      )}
    </div>
  );
};

export default LessonPlanWidget;
