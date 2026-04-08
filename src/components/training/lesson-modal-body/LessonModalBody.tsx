import React from "react";
import styles from "./LessonModalBody.module.scss";
import { tagStyles } from "@/lib/tagStyles";
import { FaChevronDown, FaStar } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@/components/button/Button";

type LessonModalBodyProps = {
  selectedPlan: any;
  drills: any[];
  closeModal: (modalName: string) => void;
  setOpenDrills: (open: boolean) => void;
  openDrills: boolean;
  onClickStart: () => void;
};

const LessonModalBody: React.FC<LessonModalBodyProps> = ({
  selectedPlan,
  drills,
  closeModal,
  setOpenDrills,
  openDrills,
  onClickStart
}) => {
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

      <div className={styles.focus}>
        <h3>Focus</h3>
        <p>{selectedPlan.notes}</p>
      </div>
      {/* <div className={styles.overview}>
        <h3>What you'll work on </h3>
        <p>{selectedPlan.notes}</p>
      </div> */}
      {/* <div className={styles.drills}>
        <h3>Drills</h3>
        {drills.map((drill: any) => (
          <div
            key={drill.id}
            className={styles.drill}
            onClick={() => setOpenDrills(!openDrills)}
          >
            <div className={styles.name}>
              <div className={styles.order}>
                <p>{drill.drill_order}</p>
              </div>
              <p className={styles.drillName}>
                {drill.drill_name} <FaChevronDown />
              </p>
            </div>
            {openDrills && (
              <div className={styles.drillDetails}>
                <p>{drill.drill_description}</p>

                <div className={styles.details}>
                  <div className={styles.detail}>
                    <p>Target</p>
                    <p>{drill.target_value}</p>
                  </div>
                  <div className={styles.detail}>
                    <p>Metric</p>
                    <p>{drill.metric}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div> */}

      <div className={styles.footer}>
        <p>{selectedPlan?.duration}</p>
        <div className={styles.buttons}>
          <Button
            children="Cancel"
            onClick={() => closeModal("lessonPlanDetails")}
            variant="secondary"
          />
          <Button
            children="Start Plan"
            onClick={onClickStart}
            variant="lessonCard"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonModalBody;
