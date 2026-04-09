"use client";

import React from "react";
import { Step } from "nextstepjs";
import styles from "./CustomCard.module.scss";
import { uploadProfileInfo } from "@/services/profile-info/uploadProfileInfo";

interface CustomCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTour?: () => void;
  arrow: React.ReactNode;
  userId: string;
  isDemoAccount?: boolean;
}

const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
  userId,
  isDemoAccount
}: CustomCardProps) => {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const handleFinish = async () => {
    if (!isDemoAccount) {
      await uploadProfileInfo({ userId: userId, is_new_account: false });
    }
    nextStep();
  };

  const handleSkip = async () => {
    if (!isDemoAccount) {
      await uploadProfileInfo({ userId: userId, is_new_account: false });
    }
    skipTour?.();
  };

  return (
    <div className={styles.card}>
      {arrow}

      <div className={styles.cardHeader}>
        <div className={styles.cardHeaderLeft}>
          {step.icon && <span className={styles.cardIcon}>{step.icon}</span>}
          <h3 className={styles.cardTitle}>{step.title}</h3>
        </div>
        <span className={styles.stepCount}>
          {currentStep + 1} of {totalSteps}
        </span>
      </div>

      <p className={styles.cardContent}>{step.content}</p>

      <div className={styles.cardButtons}>
        {step.showSkip && skipTour && !isLast && (
          <button onClick={handleSkip} className={styles.btnSkip}>
            Skip
          </button>
        )}
        {!isFirst && (
          <button onClick={prevStep} className={styles.btnPrev}>
            Back
          </button>
        )}
        <button
          onClick={isLast ? handleFinish : nextStep}
          className={styles.btnNext}
          style={isFirst ? { marginLeft: "auto" } : undefined}
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.dots}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === currentStep ? styles.dotActive : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
