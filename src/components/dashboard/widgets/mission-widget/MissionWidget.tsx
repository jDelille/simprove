"use client";

import React from "react";
import styles from "./MissionWidget.module.scss";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ActiveLesson } from "@/types/activeLesson";
import { FiArrowUpRight } from "react-icons/fi";
import { PiClipboardText } from "react-icons/pi";

type LessonPlanWidgetProps = {
  userId: string;
  activeLesson?: ActiveLesson;
};

const MissionWidget: React.FC<LessonPlanWidgetProps> = ({
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

  // console.log(lessonDrills)

  return (
    <div className={styles.widget} id="lesson-plan">
      <div className={styles.header}>
        <p>Mission</p>
      </div>

      {!isEmpty && (
        <div className={styles.content}>
          <div className={styles.title}>
            <h3>{lessonDetails?.lesson_name}</h3>
          </div>
          <div className={styles.description}>
            {lessonDetails?.lesson_description}
          </div>
          <div className={styles.drills}>
            <p className={styles.label}>Goals</p>
            {lessonDrills?.map((drill: any) => (
              <div className={styles.drill} key={drill.id}>
                <div className={drillClass(drill.status)}></div>
                <p>{drill.drill_name}</p>
              </div>
            ))}
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.labels}>
              <p>Progress</p>
              <p className={styles.progressText}>
                0 of {lessonDrills?.length || 0} goals
              </p>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{ width: `${lessonProgress || 2}%` }}
              ></div>
            </div>
          </div>
          <div className={styles.lessonInfo}>
            <div className={styles.link}>
              <Link href="/missions">
                View Mission <FiArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
      {isEmpty && (
        <div className={styles.emptyMessage}>
          <div className={styles.title}>
            <h3>No active mission</h3>
          </div>

          <div className={styles.message}>
            <PiClipboardText size={18} />
            <p>Get a personalized mission based on your swing data</p>
            <button onClick={() => router.push("/training")}>
              Browse missions <FiArrowUpRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionWidget;
