import React from "react";
import styles from "./BrowsePlans.module.scss";
import LessonCard from "../lesson-card/LessonCard";

type BrowsePlansProps = {
  plans: any[];
  onPlanClick: (plan: any) => void;
  completedLessons?: any[];
  hasActivePlan?: boolean;
};

const BrowsePlans: React.FC<BrowsePlansProps> = ({ plans, onPlanClick, completedLessons, hasActivePlan }) => {
  const nonRecommendedPlans = plans?.filter((plan) => !plan.is_ai_recommended);
  const completedLessonIds =
    completedLessons?.map((lesson) => lesson.lesson_id) || [];

  return (
    <div className={styles.browsePlans}>
      <div className={styles.plans}>
        {nonRecommendedPlans?.map((plan) => (
          <LessonCard key={plan.id} plan={plan} onPlanClick={onPlanClick} completedLessonIds={completedLessonIds} hasActivePlan={hasActivePlan} />
        ))}
      </div>
    </div>
  );
};

export default BrowsePlans;
