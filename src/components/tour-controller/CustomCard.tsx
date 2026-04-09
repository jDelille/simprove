'use client';

import React from 'react';
import { Step } from 'nextstepjs';
import styles from './CustomCard.module.scss';

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
        <div className={styles.stepCount}>
          Step {currentStep + 1} of {totalSteps}
        </div>
        <div className={styles.cardButtons}>
          {currentStep > 0 && (
            <button onClick={prevStep} className={styles.btnPrev}>
              Previous
            </button>
          )}
          <button onClick={nextStep} className={styles.btnNext}>
            {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
          </button>
          {step.showSkip && skipTour && (
            <button onClick={skipTour} className={styles.btnSkip}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomCard;