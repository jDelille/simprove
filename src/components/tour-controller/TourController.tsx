"use client";

import { Profile } from "@/types/profile";
import { useNextStep } from "nextstepjs";
import { useEffect } from "react";

type TourControllerProps = {
  profile: Profile;
};

export default function TourController({ profile }: TourControllerProps) {
  const { startNextStep } = useNextStep();

  console.log(profile)

  if (!profile.is_new_account) {
    return;
  }

    useEffect(() => {
    if (profile?.is_new_account) {
      startNextStep("welcomeTour");
    }
  }, [profile]);

  return null;
}
