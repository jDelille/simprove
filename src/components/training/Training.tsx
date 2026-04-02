"use client";

import styles from "./Training.module.scss";
import ActivePlan from "./active-plan/ActivePlan";
import RecommendedPlans from "./recommended-plans/RecommendedPlans";
import BrowsePlans from "./browse-plans/BrowsePlans";
import useModal from "@/hooks/useModal";
import Modal from "../modal/Modal";
import { useState } from "react";
import { fetchLessonDrills } from "@/services/lessons/fetchLessonDrills";
import { supabase } from "@/lib/supabase/client";
import { tagStyles } from "@/lib/tagStyles";
import { IoCloseOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import Button from "../button/Button";
import { FaChevronDown } from "react-icons/fa";

type TrainingProps = {
  lessonPlans: any[];
};

const Training: React.FC<TrainingProps> = ({ lessonPlans }) => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [drills, setDrills] = useState<any[]>([]);
  const [openDrills, setOpenDrills] = useState<boolean>(false);

  console.log(lessonPlans);
  const recommendedPlans = lessonPlans?.reduce((acc: any[], plan) => {
    if (plan.is_ai_recommended) {
      acc.push(plan);
    }
    return acc;
  }, []);

  const activePlan = false;

  async function handlePlanClick(plan: any) {
    setSelectedPlan(plan);
    openModal("lessonPlanDetails");
    const data = await fetchLessonDrills(plan.id, supabase);
    setDrills(data);
  }

  const planBody = selectedPlan ? (
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
      <div className={styles.overview}>
        <h3>What you'll work on </h3>
        <p>{selectedPlan.lesson_description}</p>
      </div>
      <div className={styles.drills}>
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
      </div>

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
            onClick={() => closeModal("lessonPlanDetails")}
            variant="lessonCard"
          />
        </div>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );

  console.log(drills, "drills");

  return (
    <div className={styles.training}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Training Plans</h1>
          <p>
            Complete tasks in your next session to earn points and level up your
            game.
          </p>
        </div>
      </div>

      <div className={styles.row}>
        <h2 className={styles.sectionName}>Your Active Plan</h2>
        {activePlan ? (
          <ActivePlan lesson={activePlan} />
        ) : (
          <p>No active plan — pick one below to get started.</p>
        )}
      </div>
      <div className={styles.row}>
        <h2 className={styles.sectionName}>Browse Plans</h2>

        {/* recommended plans */}
        <RecommendedPlans
          plans={recommendedPlans as any[]}
          onPlanClick={handlePlanClick}
        />
        {/* browse plans */}
        <BrowsePlans plans={lessonPlans as any[]} />
      </div>

      <Modal
        isOpen={modals["lessonPlanDetails"] || false}
        onClose={() => closeModal("lessonPlanDetails")}
        title={selectedPlan?.lesson_name}
        body={planBody}
        isLessonPlan={true}
      />
    </div>
  );
};

export default Training;
