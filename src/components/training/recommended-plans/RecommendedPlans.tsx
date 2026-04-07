import { r } from "highcharts";
import LessonCard from "../lesson-card/LessonCard";
import styles from "./RecommendedPlans.module.scss";

type RecommendedPlansProps = {
  onPlanClick: (plan: any) => void;
  recommendedLessons?: any[];
};

const RecommendedPlans: React.FC<RecommendedPlansProps> = ({
  onPlanClick,
  recommendedLessons
}) => {

  const plans = recommendedLessons?.map((rec) => rec.lessons);

  return (
    <div className={styles.recommendedPlans}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <p>✦</p>
        </div>
        <div className={styles.headerText}>
          <p>Recommended for you</p>
          <span>
            Based on you recent sessions — these plans are hand-picked to help you improve the most.
          </span>
        </div>
      </div>
      <div className={styles.plans}>
        {plans?.map((plan) => (
          <LessonCard key={plan.id} plan={plan} onPlanClick={onPlanClick} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlans;
