import { r } from "highcharts";
import LessonCard from "../lesson-card/LessonCard";
import styles from "./RecommendedPlans.module.scss";

type RecommendedPlansProps = {
  onPlanClick: (plan: any) => void;
  recommendedLessons?: any[];
};

const RecommendedPlans: React.FC<RecommendedPlansProps> = ({
  onPlanClick,
  recommendedLessons,
}) => {

 const plans = recommendedLessons?.map((rec) => ({
  ...rec.lessons,          
  lesson_id: rec.lesson_id, 
  reason: rec.reason,       
  is_ai_recommended: rec.is_ai_recommended || false,
  total_points: rec.total_points || rec.lessons.total_points || 0,
  duration: rec.lessons.weeks ? `${rec.lessons.weeks} sessions` : rec.lessons.duration || '',
}));

  return (
    <div className={styles.recommendedPlans}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <p>✦</p>
        </div>
        <div className={styles.headerText}>
          <p>Recommended for you</p>
          <span>
            Based on you recent sessions — these plans are hand-picked to help
            you improve the most.
          </span>
        </div>
      </div>
      <div className={styles.plans}>
        {plans?.map((plan, index) => (
          <LessonCard key={index} plan={plan} onPlanClick={onPlanClick} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlans;
