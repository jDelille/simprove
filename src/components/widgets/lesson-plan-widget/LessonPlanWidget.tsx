"use client";

import React from "react";
import styles from "./LessonPlanWidget.module.scss";
import Link from "next/link";

type LessonPlanWidgetProps = {};

const LessonPlanWidget: React.FC<LessonPlanWidgetProps> = () => {
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
                <h3>Iron consistency</h3>
              </div>
              <div className={styles.description}>
                Practice hitting irons within a 10 yard range
              </div>
              <div className={styles.drills}>
                <div className={styles.drill}>
                  <div className={styles.circle}></div>
                  <p>Hit 10 shots with a (weakest club)</p>
                </div>
                <div className={styles.drill}>
                  <div className={styles.circle}></div>
                  <p>Hit 15 shots with a (weakest club)</p>
                </div>
                <div className={styles.drill}>
                  <div className={styles.circle}></div>
                  <p>Hit 10 shots with a (weakest club)</p>
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
