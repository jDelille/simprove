import React from "react";
import styles from "./BrowsePlans.module.scss";
import LessonCard from "../lesson-card/LessonCard";

type BrowsePlansProps = {
  plans: any[];
};

const BrowsePlans: React.FC<BrowsePlansProps> = ({ plans }) => {
  const nonRecommendedPlans = plans?.filter((plan) => !plan.is_ai_recommended);

  return (
    <div className={styles.browsePlans}>
      <div className={styles.plans}>
        {nonRecommendedPlans?.map((plan) => (
          <LessonCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default BrowsePlans;
