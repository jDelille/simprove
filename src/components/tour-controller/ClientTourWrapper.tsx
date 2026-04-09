"use client";

import { NextStepProvider, NextStep } from "nextstepjs";
import TourController from "./TourController";
import CustomCard from "./CustomCard";
import { steps } from "@/lib/steps";

export default function ClientTourWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={CustomCard}
        cardTransition={{
          ease: "easeOut",
          duration: 0.4,
          stiffness: 100,
          damping: 10,
        }}
      >
        <TourController />
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
