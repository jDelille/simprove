"use client";

import { useNextStep } from "nextstepjs";

export default function TourController() {
  const { startNextStep } = useNextStep();

  return (
    <button
      onClick={() => {
        console.log("clicked");
        startNextStep("welcomeTour");
      }}
    >
      Start Tour
    </button>
  );
}
