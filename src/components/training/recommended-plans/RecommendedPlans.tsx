import LessonCard from "../lesson-card/LessonCard";
import styles from "./RecommendedPlans.module.scss";

type RecommendedPlansProps = {
  plans: any[];
};

const RecommendedPlans: React.FC<RecommendedPlansProps> = ({ plans }) => {
  console.log("Recommended plans", plans);
  return (
    <div className={styles.recommendedPlans}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <p>✦</p>
        </div>
        <div className={styles.headerText}>
          <p>Recommended for you</p>
          <span>
            Based on you recent sessions — your offline dispersion and face
            angle could use work
          </span>
        </div>
      </div>
      <div className={styles.plans}>
        {plans?.map((plan) => (
          <LessonCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedPlans;
