import React, { useEffect, useMemo, useRef } from "react";

import styles from "./SessionScoreWidget.module.scss";
import { Shot } from "@/types";

type SessionScoreWidgetProps = {
  shots: Shot[];
};

type SessionRatings = {
  sessionScore: number;
  consistency: number;
  accuracy: number;
  contact: number;
  distance: number;
};

const clamp = (num: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, num));

const average = (nums: number[]) =>
  nums.reduce((a, b) => a + b, 0) / nums.length;

const stdDev = (nums: number[]) => {
  const avg = average(nums);

  const squareDiffs = nums.map((n) => Math.pow(n - avg, 2));

  return Math.sqrt(average(squareDiffs));
};

const getScoreClass = (score: number): string => {
  if (score >= 80) return styles.green;

  if (score >= 65) return styles.yellow;

  return styles.red;
};

const getScoreLabel = (score: number): string => {
  if (score >= 85) return "Excellent";

  if (score >= 75) return "Good";

  if (score >= 60) return "Average";

  return "Needs Work";
};

// SVG ring math
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function calculateSessionRatings(shots: Shot[]): SessionRatings {
  if (!shots.length) {
    return {
      sessionScore: 0,
      consistency: 0,
      accuracy: 0,
      contact: 0,
      distance: 0,
    };
  }

  const clubs: Record<string, Shot[]> = {};

  for (const shot of shots) {
    if (!clubs[shot.club]) {
      clubs[shot.club] = [];
    }

    clubs[shot.club].push(shot);
  }

  const consistencyScores: number[] = [];
  const accuracyScores: number[] = [];
  const contactScores: number[] = [];
  const distanceScores: number[] = [];

  const targetCarry: Record<string, number> = {
    GW: 110,
    PW: 130,
    I9: 145,
    I8: 160,
    I7: 175,
    I6: 185,
    I5: 195,
    I4: 205,
    H3: 215,
    W3: 225,
    DR: 250,
  };

  Object.entries(clubs).forEach(([club, clubShots]) => {
    if (clubShots.length < 3) return;

    const carries = clubShots.map((s) => s.carry);

    const spins = clubShots.map((s) => s.backSpin);

    const ballSpeeds = clubShots.map((s) => s.ballSpeed);

    const avgCarry = average(carries);
    const avgSpin = average(spins);

    const carryStd = stdDev(carries);
    const spinStd = stdDev(spins);
    const speedStd = stdDev(ballSpeeds);

    // CONSISTENCY
    const consistency = 100 - carryStd * 3 - speedStd * 2 - spinStd / 300;

    consistencyScores.push(clamp(consistency));

    // ACCURACY
    let outliers = 0;

    for (const shot of clubShots) {
      if (Math.abs(shot.carry - avgCarry) > 12) {
        outliers++;
      }
    }

    const outlierPenalty = (outliers / clubShots.length) * 100;

    accuracyScores.push(clamp(100 - outlierPenalty));

    // CONTACT
    let idealSpin = 7000;

    if (club === "DR") idealSpin = 2600;
    else if (club === "W3") idealSpin = 3500;
    else if (club === "H3") idealSpin = 4000;
    else if (club.includes("I")) idealSpin = 6000;

    const spinPenalty = Math.abs(avgSpin - idealSpin) / 80;

    const contact = 100 - spinPenalty - speedStd * 2;

    contactScores.push(clamp(contact));

    // DISTANCE
    const target = targetCarry[club] || avgCarry;

    const distance = (avgCarry / target) * 100;

    distanceScores.push(clamp(distance));
  });

  const consistency = Math.round(average(consistencyScores));

  const accuracy = Math.round(average(accuracyScores));

  const contact = Math.round(average(contactScores));

  const distance = Math.round(average(distanceScores));

  const sessionScore = Math.round(
    consistency * 0.35 + accuracy * 0.25 + contact * 0.25 + distance * 0.15,
  );

  return {
    sessionScore,
    consistency,
    accuracy,
    contact,
    distance,
  };
}

const SessionScoreWidget = ({ shots }: SessionScoreWidgetProps) => {
  const ratings = useMemo(() => calculateSessionRatings(shots), [shots]);

  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = ringRef.current;

    if (!el) return;

    const targetOffset =
      CIRCUMFERENCE - (ratings.sessionScore / 100) * CIRCUMFERENCE;

    el.style.strokeDashoffset = String(CIRCUMFERENCE);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = String(targetOffset);
      });
    });
  }, [ratings.sessionScore]);

  const scoreClass = getScoreClass(ratings.sessionScore);

  const scoreLabel = getScoreLabel(ratings.sessionScore);

  return (
    <div className={styles.sessionScoreWidget}>
      <div className={styles.header}>
        <h3>Session Score</h3>
      </div>

      <div className={styles.body}>
        <div className={styles.mainScore}>
          <div className={styles.ringWrap}>
            <svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              className={styles.ringSvg}
            >
              {/* Track */}
              <circle
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke="var(--border)"
                strokeWidth="9"
              />

              {/* Progress Arc */}
              <circle
                ref={ringRef}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
                transform="rotate(-90 50 50)"
                className={`${styles.ringArc} ${scoreClass}`}
              />

              {/* Score */}
              <text
                x="50"
                y="50"
                textAnchor="middle"
                fill="var(--text)"
                fontSize="22"
                fontWeight="700"
              >
                {ratings.sessionScore}
              </text>

              {/* /100 */}
              <text
                x="50"
                y="63"
                textAnchor="middle"
                fill="var(--lightgray)"
                fontSize="9"
              >
                /100
              </text>
            </svg>
          </div>
          <div className={styles.breakdown}>
            <div className={styles.row}>
              <span>Consistency</span>

              <span>{ratings.consistency}</span>
            </div>

            <div className={styles.row}>
              <span>Accuracy</span>

              <span>{ratings.accuracy}</span>
            </div>

            <div className={styles.row}>
              <span>Contact</span>

              <span>{ratings.contact}</span>
            </div>

            <div className={styles.row}>
              <span>Distance</span>

              <span>{ratings.distance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionScoreWidget;
