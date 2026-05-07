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
    if (profile?.is_new_account && isDashboardPage) {
      setIsTourActive(true);
      startNextStep("welcomeTour");
    }
  }, [profile?.is_new_account, isDashboardPage]);

  return null;
}