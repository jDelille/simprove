"use client";

import { Profile } from "@/types/profile";
import { usePathname } from "next/navigation";
import { useNextStep } from "nextstepjs";
import { useEffect } from "react";

type TourControllerProps = {
  profile: Profile;
  setIsTourActive: (isActive: boolean) => void;
};

export default function TourController({
  profile,
  setIsTourActive,
}: TourControllerProps) {
  const { startNextStep } = useNextStep();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";

useEffect(() => {
  const hasCompletedTour =
    localStorage.getItem("simprove-tour-completed") === "true";

  if (profile?.is_new_account && isDashboardPage && !hasCompletedTour) {
    performance.mark('DashboardPage'); // set mark before nextstepjs looks for it
    setTimeout(() => {
      setIsTourActive(true);
      startNextStep("welcomeTour");
    }, 300); // give the dashboard time to fully mount
  }
}, [profile?.is_new_account, isDashboardPage]);

  return null;
}
