"use client";

import React from "react";
import { Step } from "nextstepjs";
import styles from "./CustomCard.module.scss";
import Button from "../button/Button";

interface CustomCardProps {
  step: Step;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipTour?: () => void;
  arrow: React.ReactNode;
}

const CustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CustomCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        {step.icon && <div className={styles.cardIcon}>{step.icon}</div>}
        <h3 className={styles.cardTitle}>{step.title}</h3>
      </div>

      <div className={styles.cardContent}>{step.content}</div>

      {arrow}

      <div className={styles.cardFooter}>
        <div className={styles.cardButtons}>
          <Button
              onClick={prevStep}
              children="Previous"
              variant="secondary"
              disabled={currentStep === 0}
            />

          <div className={styles.stepCount}>
            {currentStep + 1} of {totalSteps}
          </div>

          <Button
            onClick={nextStep}
            children={currentStep === totalSteps - 1 ? "Finish" : "Next"}
            variant="lessonCard"
          />
        </div>
        {currentStep !== totalSteps - 1 && (
          <div className={styles.skip}>
          {step.showSkip && skipTour && (
            <Button children="Skip" onClick={skipTour} variant="secondary" />
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default CustomCard;
