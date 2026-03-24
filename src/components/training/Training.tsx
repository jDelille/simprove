"use client";

import { useLessonPlans } from "@/hooks/useLessonPlans";
import styles from "./Training.module.scss";
import ActivePlan from "./active-plan/ActivePlan";
import RecommendedPlans from "./recommended-plans/RecommendedPlans";
import BrowsePlans from "./browse-plans/BrowsePlans";

const Training = () => {
  const { data: lessonPlans } = useLessonPlans();

  const recommendedPlans = lessonPlans?.reduce((acc: any[], plan) => {
    if (plan.is_ai_recommended) {
      acc.push(plan);
    }
    return acc;
  }, []);

  const activePlan = lessonPlans?.find((p) => p.status === "active") ?? null;

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
        <h2 className={styles.sectionName}>Your Active Plan</h2>
        {activePlan ? (
          <ActivePlan lesson={activePlan} />
        ) : (
          <p>No active plan — pick one below to get started.</p>
        )}
      </div>
      <div className={styles.row}>
        <h2 className={styles.sectionName}>Browse Plans</h2>

        {/* recommended plans */}
        <RecommendedPlans plans={recommendedPlans as any[]} />
        {/* browse plans */}
        <BrowsePlans plans={lessonPlans as any[]} />
      </div>
    </div>
  );
};

export default Training;
