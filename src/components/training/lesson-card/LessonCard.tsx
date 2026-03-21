import Button from "@/components/button/Button";
import styles from "./LessonCard.module.scss";
import { FaStar } from "react-icons/fa";

type LessonCardProps = {
  plan: any;
};

const LessonCard: React.FC<LessonCardProps> = ({ plan }) => {
    
  const tagStyles = (tag: string) => {
    switch (tag) {
      case "Beginner":
        return styles.beginnerTag;
      case "Intermediate":
        return styles.intermediateTag;
      case "Advanced":
        return styles.advancedTag;
      case "single":
        return styles.singleTag;
      case "multi":
        return styles.multiTag;
      default:
        return "";
    }
  };

  return (
    <div className={styles.lessonCard}>
      <div className={styles.tags}>
        {plan.is_ai_recommended && (
          <span className={styles.tag}> ✦ AI Pick</span>
        )}
        <span className={tagStyles(plan.lesson_difficulty)}>{plan.lesson_difficulty}</span>
        <span className={tagStyles(plan.type)}>{plan.type}</span>
      </div>
      <div className={styles.points}>
        <FaStar size={12} /> {plan.total_points} pts
      </div>
      <h3 className={styles.lessonName}>{plan.lesson_name}</h3>
      <p className={styles.lessonDescription}>{plan.lesson_description}</p>
      <div className={styles.notes}>
        <p>{plan.notes}</p>
      </div>

      <div className={styles.footer}>
        <p>{plan.duration}</p>
        <Button variant="lessonCard" children="Start plan" />
      </div>
    </div>
  );
};

export default LessonCard;
