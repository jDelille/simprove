"use client";

import { NextStepProvider, NextStep } from "nextstepjs";
import TourController from "./TourController";
import CustomCard from "./CustomCard";
import { steps } from "@/lib/steps";
import { Profile } from "@/types/profile";
import { useTheme } from "@/context/ThemeContext";

export default function ClientTourWrapper({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {

  const {theme} = useTheme();

  const isDarkMode = theme === "dark";
  

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={CustomCard}
        shadowRgb={isDarkMode ? "255, 255, 255" : "0, 0, 0"}
        shadowOpacity={isDarkMode ? "0.15" : "0.2"}
        cardTransition={{
          ease: "easeOut",
          duration: 0.4,
          stiffness: 100,
          damping: 10,
        }}
      >
        <TourController profile={profile} />
        {children}
      </NextStep>
    </NextStepProvider>
  );
}
