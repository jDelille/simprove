'use client';

import { useNextStep } from 'nextstepjs';

export default function RestartTourButton() {
  const { startNextStep } = useNextStep();

  return (
    <button onClick={() => startNextStep('welcomeTour')}>
      Replay Tour
    </button>
  );
}