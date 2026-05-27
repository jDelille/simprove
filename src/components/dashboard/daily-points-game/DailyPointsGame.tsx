import React, { useState, useEffect, useRef } from "react";
import styles from "./DailyPointsGame.module.scss";
import Button from "@/components/ui/button/Button";
import usePopup from "@/hooks/usePopup";
import { awardUserPoints } from "@/services/user-points/uploadUserPoints";
import { createClient } from "@/lib/supabase/client";
import { updateLastRolled } from "@/services/profile/updateLastRollDate";
import { IoClose } from "react-icons/io5";
import { updateStreak } from "@/services/profile/updateStreak";

const TARGET = Math.floor(Math.random() * 300) + 50;
const MAX = 400;

const getResult = (diff: number) => {
  if (diff <= 5) return { flavor: "Stiff!", pts: 100 };
  if (diff <= 15) return { flavor: "On the green", pts: 80 };
  if (diff <= 35) return { flavor: "Just missed", pts: 55 };
  if (diff <= 70) return { flavor: "In the rough", pts: 30 };
  return { flavor: "Way offline", pts: 10 };
};

const getSpeed = (elapsed: number) => {
  if (elapsed < 1200) return 0.8 + (elapsed / 1200) * 1.2;
  if (elapsed < 2500) return 2.0 + ((elapsed - 1200) / 1300) * 2.5;
  return 4.5;
};

const getPhaseLabel = (elapsed: number) => {
  if (elapsed < 1200) return "Building up...";
  if (elapsed < 2500) return "Finding your line...";
  return "Now!";
};

type DailyPointsGameProps = {
  userId: string;
};

const supabase = createClient();

const DailyPointsGame = ({
  userId,
  onComplete,
}: DailyPointsGameProps & { onComplete: () => void }) => {
  const [running, setRunning] = useState(false);
  const [value, setValue] = useState(0);
  const [phase, setPhase] = useState("Hit swing to start");
  const [result, setResult] = useState<{
    flavor: string;
    pts: number;
    diff: number;
    final: number;
  } | null>(null);
  const [done, setDone] = useState(false);
  const { closePopup } = usePopup();

  const animFrame = useRef<number | null>(null);
  const valueRef = useRef(0);
  const dirRef = useRef(1);
  const startTs = useRef<number | null>(null);
  const lastTs = useRef<number | null>(null);

  const tick = (ts: number) => {
    if (!startTs.current) startTs.current = ts;
    if (!lastTs.current) lastTs.current = ts;

    const delta = ts - lastTs.current;
    const elapsed = ts - startTs.current;
    lastTs.current = ts;

    const speed = getSpeed(elapsed);
    valueRef.current += dirRef.current * speed * (delta / 16);

    if (valueRef.current >= MAX) {
      valueRef.current = MAX;
      dirRef.current = -1;
    }
    if (valueRef.current <= 0) {
      valueRef.current = 0;
      dirRef.current = 1;
    }

    setValue(Math.round(valueRef.current));
    setPhase(getPhaseLabel(elapsed));

    animFrame.current = requestAnimationFrame(tick);
  };

  const handleSwing = () => {
    if (done) return;

    if (!running) {
      setRunning(true);
      setResult(null);
      dirRef.current = 1;
      startTs.current = null;
      lastTs.current = null;
      animFrame.current = requestAnimationFrame(tick);
    } else {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
      setRunning(false);
      setDone(true);

      const final = Math.round(valueRef.current);
      const diff = Math.abs(final - TARGET);
      const { flavor, pts } = getResult(diff);
      setResult({ flavor, pts, diff, final });
      setPhase(final + " yards");
    }
  };

  useEffect(() => {
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  const handleCollectPoints = async () => {
    if (!result) return;

    await Promise.all([
      awardUserPoints(userId, result.pts, supabase),
      updateLastRolled(userId, supabase),
      updateStreak(userId, supabase),
    ]);

    onComplete();
    closePopup("dailyPoints");
  };

  const targetPct = (TARGET / MAX) * 100;
  const valuePct = (value / MAX) * 100;
  const diffStr = result
    ? result.final === TARGET
      ? "Dead on the pin"
      : result.final > TARGET
        ? `${result.diff} yards long`
        : `${result.diff} yards short`
    : "";

  return (
    <div className={styles.wrap}>
      <IoClose
        className={styles.closeBtn}
        onClick={() => closePopup("dailyPoints")}
      />
      <div className={styles.targetCard}>
        <p className={styles.targetLabel}>Today's target</p>
        <p className={styles.targetYardage}>{TARGET}</p>
        <p className={styles.targetUnit}>yards to the pin</p>
      </div>

      <p className={styles.currentVal}>{value}</p>
      <p className={styles.currentUnit}>yards</p>

      <div className={styles.meterWrap}>
        <div className={styles.meterTrack}>
          <div className={styles.meterFill} style={{ width: `${valuePct}%` }} />
          <div
            className={styles.meterTargetLine}
            style={{ left: `${targetPct}%` }}
          />
        </div>
        <div className={styles.meterLabels}>
          {[0, 100, 200, 300, 400].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>

      <p className={styles.phaseLabel}>{phase}</p>

      <button className={styles.swingBtn} onClick={handleSwing} disabled={done}>
        {!running ? "Swing" : "Stop"}
      </button>

      {result && (
        <div className={styles.resultCard}>
          <p className={styles.resultFlavor}>{result.flavor}</p>
          <p className={styles.resultDiff}>{diffStr}</p>
          <p className={styles.resultPts}>
            Bonus earned: <span>+{result.pts} pts</span>
          </p>
        </div>
      )}
      {result && (
        <Button
          variant="lessonCard"
          children={"Collect points"}
          onClick={handleCollectPoints}
        />
      )}
    </div>
  );
};

export default DailyPointsGame;
