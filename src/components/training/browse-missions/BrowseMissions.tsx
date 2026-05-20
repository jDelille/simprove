import React from "react";
import styles from "./BrowseMissions.module.scss";
import MissionCard from "../mission-card/MissionCard";

type BrowseMissionsProps = {
  plans: any[];
  onPlanClick: (plan: any) => void;
  completedLessons?: any[];
  hasActivePlan?: boolean;
};

const BrowseMissions: React.FC<BrowseMissionsProps> = ({ plans, onPlanClick, completedLessons, hasActivePlan }) => {
  const nonRecommendedPlans = plans?.filter((plan) => !plan.is_ai_recommended);
  const completedLessonIds =
    completedLessons?.map((lesson) => lesson.lesson_id) || [];

  return (
    <div className={styles.browsePlans}>
      <div className={styles.plans}>
        {nonRecommendedPlans?.map((plan) => (
          <MissionCard key={plan.id} plan={plan} onPlanClick={onPlanClick} completedLessonIds={completedLessonIds} hasActivePlan={hasActivePlan} />
        ))}
      </div>
    </div>
  );
};

export default BrowseMissions;
