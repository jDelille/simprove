"use client";

import { NextStepProvider, NextStep, CardComponentProps } from "nextstepjs";
import TourController from "./TourController";
import CustomCard from "./CustomCard";
import { steps } from "@/lib/steps";
import { Profile } from "@/types/profile";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { TourContext } from "./TourContext";

export default function ClientTourWrapper({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile | null;
}) {
  const [isTourActive, setIsTourActive] = useState(false); // ✅ MOVE UP

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (!profile) {
    return <h1>{children}</h1>;
  }

  const TourCard = (props: CardComponentProps) => (
    <CustomCard
      {...props}
      userId={profile.id}
      isDemoAccount={profile.is_demo_account}
      setIsTourActive={setIsTourActive}
    />
  );

  return (
    <TourContext.Provider value={{ isTourActive }}>
      <NextStepProvider>
        <NextStep steps={steps} cardComponent={TourCard}>
          <TourController
            profile={profile}
            setIsTourActive={setIsTourActive}
          />
          {children}
        </NextStep>
      </NextStepProvider>
    </TourContext.Provider>
  );
}