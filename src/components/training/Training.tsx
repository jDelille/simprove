"use client";

import styles from "./Training.module.scss";
import ActivePlan from "./active-plan/ActivePlan";
import RecommendedPlans from "./recommended-plans/RecommendedPlans";
import BrowsePlans from "./browse-plans/BrowsePlans";
import useModal from "@/hooks/useModal";
import { useState } from "react";
import { fetchLessonDrills } from "@/services/lessons/fetchLessonDrills";
import LessonModalBody from "./lesson-modal-body/LessonModalBody";
import { uploadLessonPlan } from "@/services/lessons/uploadLessonPlan";
import { createClient } from "@/lib/supabase/client";
import { ActiveLesson } from "@/types/activeLesson";
import { RecommendedLessons } from "@/types/recommendedLessons";
import { fetchActiveLessonClient } from "@/lib/activeLesson";
import Modal from "../ui/modal/Modal";

type TrainingProps = {
  lessonPlans: any[];
  userId: string;
  activeLesson?: ActiveLesson;
  recommendedLessons?: RecommendedLessons[];
  completedLessons?: any[];
};

const Training: React.FC<TrainingProps> = ({
  lessonPlans,
  userId,
  activeLesson,
  recommendedLessons,
  completedLessons,
}) => {
  const { modals, openModal, closeModal } = useModal();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [drills, setDrills] = useState<any[]>([]);
  const [openDrills, setOpenDrills] = useState<boolean>(false);
  const [activePlanState, setActivePlanState] = useState<any>(
    activeLesson ?? null,
  );

  const supabase = createClient();

  const activePlan = activePlanState;
  const isEmpty = !activePlanState || activePlanState.activeLesson === null;

  const noRecommended = !recommendedLessons || recommendedLessons.length === 0;

  // console.log(activePlan, "active plan");

  async function handlePlanClick(plan: any) {
    setSelectedPlan(plan);
    openModal("lessonPlanDetails");
    const data = await fetchLessonDrills(plan.id, supabase);
    setDrills(data);
  }

  const handleStartPlan = async () => {
    if (!selectedPlan) return;
    await uploadLessonPlan({
      userId: userId,
      lessonId: selectedPlan.id,
      supabaseClient: supabase,
    });

    const updatedActiveLesson = await fetchActiveLessonClient(userId);
    setActivePlanState(updatedActiveLesson);

    closeModal("lessonPlanDetails");
  };

  const planBody = selectedPlan ? (
    <LessonModalBody
      closeModal={closeModal}
      selectedPlan={selectedPlan}
      drills={drills}
      setOpenDrills={setOpenDrills}
      openDrills={openDrills}
      onClickStart={handleStartPlan}
      completedLessonIds={completedLessons?.map((lesson) => lesson.lesson_id) || []}
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
          <p className={styles.emptyMessage}>
            No active plan — pick one below to get started.
          </p>
        )}
      </div>
      <div className={styles.row}>
        {/* recommended plans */}
        {recommendedLessons && !noRecommended && (
          <RecommendedPlans
            onPlanClick={handlePlanClick}
            recommendedLessons={recommendedLessons}
            completedLessons={completedLessons}
            hasActivePlan={activePlan?.activeLesson !== null}
          />
        )}
        <h2 className={styles.sectionName}>Browse Plans</h2>

        {/* browse plans */}
        <BrowsePlans
          plans={lessonPlans as any[]}
          onPlanClick={handlePlanClick}
          completedLessons={completedLessons}
          hasActivePlan={activePlan?.activeLesson !== null}
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
