"use client";

import { NextStepProvider, NextStep, CardComponentProps } from "nextstepjs";
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
  profile: Profile | null;
}) {

  if (!profile) {
    return <h1>{children}</h1>;
  }

  const TourCard = (props: CardComponentProps) => (
    <CustomCard {...props} userId={profile?.id} isDemoAccount={profile.is_demo_account} />
  );

  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <NextStepProvider>
      <NextStep
        steps={steps}
        cardComponent={TourCard}
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
