import { FaStar } from "react-icons/fa";
import { tagStyles } from "@/lib/tagStyles";
import styles from "./MissionCard.module.scss";
import Button from "@/components/ui/button/Button";

type MissionCardProps = {
  plan: any;
  onPlanClick: (plan: any) => void;
  completedLessonIds?: string[];
  hasActivePlan?: boolean;
  isAiRecommended?: boolean;
};

const MissionCard: React.FC<MissionCardProps> = ({
  plan,
  onPlanClick,
  completedLessonIds,
  hasActivePlan = false,
  isAiRecommended = false,
}) => {
  // console.log(plan);

  return (
    <div className={styles.missionCard}>
      <div className={styles.tags}>
        {isAiRecommended && <span className={styles.tag}> ✦ AI Pick</span>}
        <span className={tagStyles(styles, plan.lesson_difficulty)}>
          {plan.lesson_difficulty}
        </span>
        <span className={tagStyles(styles, plan.type)}>{plan.type}</span>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{plan.lesson_name}</h3>
        <p className={styles.description}>{plan.lesson_description}</p>
        {isAiRecommended && (
          <div className={styles.notes}>
            <p>{plan.reason}</p>
          </div>
        )}

        {/* goals */}
        <div className={styles.goals}>
          <ul>
            {plan.lesson_drills?.map((drill: any, index: number) => (
              <li key={index}>{drill.drill_name}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* <div className={styles.footer}>
        {!completedLessonIds?.includes(plan.lesson_id) ? (
          <Button
            variant="lessonCard"
            children={"Start lesson"}
            onClick={() => onPlanClick(plan)}
            disabled={hasActivePlan}
          />
        ) : (
          <p>Completed</p>
        )}
      </div> */}
    </div>
  );
};

export default MissionCard;
