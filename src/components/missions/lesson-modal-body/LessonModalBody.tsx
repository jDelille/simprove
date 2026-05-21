import React from "react";
import { tagStyles } from "@/lib/tagStyles";
import { FaStar } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./LessonModalBody.module.scss";
import Button from "@/components/ui/button/Button";

type LessonModalBodyProps = {
  selectedPlan: any;
  drills: any[];
  closeModal: (modalName: string) => void;
  setOpenDrills: (open: boolean) => void;
  openDrills: boolean;
  onClickStart: () => void;
  completedLessonIds?: string[];
};

const LessonModalBody: React.FC<LessonModalBodyProps> = ({
  selectedPlan,
  drills,
  closeModal,
  setOpenDrills,
  openDrills,
  onClickStart,
  completedLessonIds,
}) => {
  console.log("Selected Plan:", selectedPlan);
  return (
    <div className={styles.planBody}>
      <div className={styles.tags}>
        <span className={tagStyles(styles, selectedPlan.lesson_difficulty)}>
          {selectedPlan.lesson_difficulty}
        </span>
        <span className={tagStyles(styles, selectedPlan.type)}>
          {selectedPlan.type}
        </span>
      </div>
      <div className={styles.actions}>
        <div className={styles.points}>
          <FaStar size={12} /> {selectedPlan.total_points} pts
        </div>
        <div className={styles.close}>
          <div
            className={styles.iconBg}
            onClick={() => closeModal("lessonPlanDetails")}
          >
            <IoCloseOutline size={18} />
          </div>
        </div>
      </div>
      <div className={styles.title}>
        <h3>{selectedPlan.lesson_name}</h3>
      </div>
      <div className={styles.description}>
        <p>{selectedPlan.lesson_description}</p>
      </div>

      <div className={styles.goals}>
        <h3>Goals</h3>

        <ul>
          {selectedPlan.lesson_drills.map((drill: any) => (
            <li key={drill.drill_id}>
               {drill.drill_name}
            </li>
          ))}
        </ul>
      </div>
      {/* <FaStar size={12} /> */}


      <div className={styles.footer}>
        <p>{selectedPlan?.duration}</p>
        <div className={styles.buttons}>
          <Button
            children="Cancel"
            onClick={() => closeModal("lessonPlanDetails")}
            variant="secondary"
          />
          {!completedLessonIds?.includes(selectedPlan.lesson_id) ? (
            <Button
              children="Start Plan"
              onClick={onClickStart}
              variant="lessonCard"
            />
          ) : (
            <p>Completed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonModalBody;
