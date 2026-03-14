"use client";

import { useLessonPlans } from "@/hooks/useLessonPlans";
import styles from "./Training.module.scss";
import ActivePlan from "./active-plan/ActivePlan";

const Training = () => {
  const { data: lessonPlans } = useLessonPlans();

  return (
    <div className={styles.training}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Training Plans</h1>
          <p>
            Complete tasks in your next session to earn points and level up your
            game.
          </p>
        </div>
      </div>

      <div className={styles.row}>
        <ActivePlan lesson={lessonPlans?.[0]} />
      </div>
      <div className={styles.row}>
        {/* recommended plans */}
        {/* browse plans */}
      </div>
    </div>
  );
};

export default Training;
