import Button from "@/components/button/Button";
import styles from "./LessonCard.module.scss";
import { FaStar } from "react-icons/fa";
import { tagStyles } from "@/lib/tagStyles";

type LessonCardProps = {
  plan: any;
  onPlanClick: (plan: any) => void;
};

const LessonCard: React.FC<LessonCardProps> = ({ plan, onPlanClick }) => {
  return (
    <div className={styles.lessonCard} onClick={() => onPlanClick(plan)}>
      <div className={styles.content}>
        <div className={styles.tags}>
          {plan.is_ai_recommended && (
            <span className={styles.tag}> ✦ AI Pick</span>
          )}
          <span className={tagStyles(styles, plan.lesson_difficulty)}>
            {plan.lesson_difficulty}
          </span>
          <span className={tagStyles(styles, plan.type)}>{plan.type}</span>
        </div>
        <div className={styles.points}>
          <FaStar size={12} /> {plan.total_points} pts
        </div>
        <h3 className={styles.lessonName}>{plan.lesson_name}</h3>
        <p className={styles.lessonDescription}>{plan.lesson_description}</p>
        <div className={styles.notes}>
          <p>{plan.reason}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <p>{plan.duration}</p>
        <Button variant="lessonCard" children="Start plan" />
      </div>
    </div>
  );
};

export default LessonCard;
