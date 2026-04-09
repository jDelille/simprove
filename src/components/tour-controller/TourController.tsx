"use client";

import { Profile } from "@/types/profile";
import { usePathname } from "next/navigation";
import { useNextStep } from "nextstepjs";
import { useEffect } from "react";

type TourControllerProps = {
  profile: Profile;
};

export default function TourController({ profile }: TourControllerProps) {
  const { startNextStep } = useNextStep();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";

  useEffect(() => {
    if (profile?.is_new_account && isDashboardPage) {
      startNextStep("welcomeTour");
    }
  }, [profile]);

  return null;
}