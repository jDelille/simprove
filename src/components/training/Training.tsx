"use client";

import styles from "./Training.module.scss";
import ActivePlan from "./active-plan/ActivePlan";
import RecommendedPlans from "./recommended-plans/RecommendedPlans";
import BrowsePlans from "./browse-plans/BrowsePlans";
import useModal from "@/hooks/useModal";
import Modal from "../modal/Modal";
import { useState } from "react";
import { fetchLessonDrills } from "@/services/lessons/fetchLessonDrills";
import LessonModalBody from "./lesson-modal-body/LessonModalBody";
import { uploadLessonPlan } from "@/services/lessons/uploadLessonPlan";
import { createClient } from "@/lib/supabase/client";

type TrainingProps = {
  lessonPlans: any[];
  userId: string;
  activeLesson?: any;
  recommendedLessons?: any[];
};

const Training: React.FC<TrainingProps> = ({
  lessonPlans,
  userId,
  activeLesson,
  recommendedLessons,
}) => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [drills, setDrills] = useState<any[]>([]);
  const [openDrills, setOpenDrills] = useState<boolean>(false);

  const supabase = createClient();

  const recommendedPlans = lessonPlans?.reduce((acc: any[], plan) => {
    if (plan.is_ai_recommended) {
      acc.push(plan);
    }
    return acc;
  }, []);

  const activePlan = activeLesson ? activeLesson : null;
  const isEmpty = !activeLesson || activeLesson.activeLesson === null;

  async function handlePlanClick(plan: any) {
    setSelectedPlan(plan);
    openModal("lessonPlanDetails");
    const data = await fetchLessonDrills(plan.id, supabase);
    setDrills(data);
  }

  const handleStartPlan = async () => {
    if (selectedPlan) {
      await uploadLessonPlan({
        userId: userId,
        lessonId: selectedPlan.id,
      });
      console.log("clicked", userId, selectedPlan.id);
      closeModal("lessonPlanDetails");
    }
  };

  console.log("training drills:", drills);

  const planBody = selectedPlan ? (
    <LessonModalBody
      closeModal={closeModal}
      selectedPlan={selectedPlan}
      drills={drills}
      setOpenDrills={setOpenDrills}
      openDrills={openDrills}
      onClickStart={handleStartPlan}
    />
  ) : (
    <p>Loading...</p>
  );

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
        {!isEmpty ? (
          <ActivePlan lesson={activePlan} />
        ) : (
          <p>No active plan — pick one below to get started.</p>
        )}
      </div>
      <div className={styles.row}>
        <h2 className={styles.sectionName}>Browse Plans</h2>

        {/* recommended plans */}
        {recommendedLessons && (
          <RecommendedPlans
            onPlanClick={handlePlanClick}
            recommendedLessons={recommendedLessons}
          />
        )}
        {/* browse plans */}
        <BrowsePlans
          plans={lessonPlans as any[]}
          onPlanClick={handlePlanClick}
        />
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
