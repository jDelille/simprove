"use client";

import { useState } from "react";
import styles from "./MissTendencyWidget.module.scss";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import ClubSelect from "@/components/club-select/ClubSelect";
import { Shot } from "@/types/shot";

type MissTendencyWidgetProps = {
  shots: Shot[];
};

const MissTendencyWidget: React.FC<MissTendencyWidgetProps> = ({ shots }) => {
  const clubs = [...new Set(shots.map((shot) => shot.club))];
  const [selectedClub, setSelectedClub] = useState(clubs[0] || "");

  const isEmpty = shots.length === 0;

  const MAX_OFFLINE = 20;
  const clubShots = shots.filter((shot) => shot.club === selectedClub);

  const avgOffline =
    clubShots.reduce((sum, shot) => sum + (shot.offline ?? 0), 0) /
      clubShots.length || 0;
  const avgFace =
    clubShots.reduce((sum, shot) => sum + (shot.faceToTarget ?? 0), 0) /
      clubShots.length || 0;
  const swingPath =
    clubShots.reduce((sum, shot) => sum + (shot.path ?? 0), 0) /
      clubShots.length || 0;

  const offlineLabel = (val: number) => {
    if (val < -MAX_OFFLINE)
      return { text: "Severe left miss", color: "#e05252" };
    if (val > MAX_OFFLINE)
      return { text: "Severe right miss", color: "#d4921b" };
    return { text: "Centered", color: "#18a96b" };
  };

  const percent =
    ((Math.min(Math.max(avgOffline, -MAX_OFFLINE), MAX_OFFLINE) + MAX_OFFLINE) /
      (MAX_OFFLINE * 2)) *
    100;

  const getMissMessage = (
    offline: number,
    face: number,
    path: number,
  ): string => {
    const dir = offline >= 0 ? "right" : "left";
    const absOffline = Math.abs(offline).toFixed(1);
    const absFace = Math.abs(face).toFixed(1);

    const missText = `Consistent ${dir} miss (${absOffline} yds avg).`;

    const faceText =
      face > 1.5
        ? `Face is open (+${absFace}°)`
        : face < -1.5
          ? `Face is closed (-${absFace}°)`
          : `Face is square (${absFace}°)`;

    const tip =
      face > 1.5
        ? "try a stronger grip or earlier forearm rotation"
        : face < -1.5
          ? "try a weaker grip or delayed forearm rotation"
          : path < -2
            ? "focus on swinging more in-to-out"
            : path > 2
              ? "focus on swinging more out-to-in"
              : "contact is the main factor — focus on center strikes";

    return `${missText} ${faceText} — ${tip}.`;
  };

  return (
    <div className={styles.widget} id="miss-tendency">
      <div className={styles.header}>
        <p>Miss Tendency</p>
        <span>Offline · Face to target · Swing path</span>
      </div>
      {!isEmpty && (
        <>
          <ClubSelect
            clubs={clubs}
            setSelectedClub={setSelectedClub}
            selectedClub={selectedClub}
          />
          <div className={styles.missLineContainer}>
            <div className={styles.labels}>
              <p>
                <HiOutlineArrowNarrowLeft />
                Left miss
              </p>
              <p>
                Right miss
                <HiOutlineArrowNarrowRight />
              </p>
            </div>
            <div
              className={styles.missLine}
              style={isEmpty ? { background: "var(--lightgray)" } : undefined}
            >
              <div
                style={{
                  position: "absolute",
                  left: percent > 50 ? "50%" : `${percent}%`,
                  width: `${Math.abs(percent - 50)}%`,
                  height: "100%",
                  background: isEmpty ? "var(--lightgray)" : "var(--accent)",
                  borderRadius: 999,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${percent}%`,
                  transform: "translate(-50%, -50%)",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  outline: "2px solid var(--accent)",
                  background: isEmpty ? "var(--lightgray)" : "#195fa6",
                  border: "2px solid var(--bg)",
                }}
              />
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3 style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
                {isEmpty ? "—" : avgOffline.toFixed(1)}
              </h3>
              <p>Offline (yds)</p>
            </div>
            <div className={styles.stat}>
              <h3 style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
                {isEmpty ? "—" : `${avgFace.toFixed(1)}°`}
              </h3>
              <p>Face to Target</p>
            </div>
            <div className={styles.stat}>
              <h3 style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
                {isEmpty ? "—" : `${swingPath.toFixed(1)}°`}
              </h3>
              <p>Swing Path</p>
            </div>
          </div>
          <div className={isEmpty ? styles.emptyMessage : styles.message}>
            <p>
              {isEmpty
                ? "Your miss pattern analysis will appear here once you upload session data."
                : getMissMessage(avgOffline, avgFace, swingPath)}
            </p>
          </div>
        </>
      )}

      {isEmpty && (
        <div className={styles.emptyState}>
          <p>
            Your miss tendency analysis will appear here once you upload session data.
          </p>
        </div>
      )}
    </div>
  );
};

export default MissTendencyWidget;
