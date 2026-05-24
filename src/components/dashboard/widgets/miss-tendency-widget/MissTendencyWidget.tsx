"use client";

import { useState } from "react";
import styles from "./MissTendencyWidget.module.scss";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import ClubSelect from "@/components/club-select/ClubSelect";
import { Shot } from "@/types/shot";
import { GiArcheryTarget } from "react-icons/gi";
import NoDataPlaceholderWidget from "@/components/ui/no-data-placeholder-widget/NoDataPlaceholderWidget";

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
        ? "Your face is staying open through impact. Focus on rotating the forearms earlier and feeling the logo on your glove turn down through the strike."
        : face < -1.5
          ? "The clubface is shutting down too quickly. Feel more passive hand rotation through impact and maintain body rotation longer."
          : path < -2
            ? "Your swing path is moving too far out-to-in. Try feeling the club approach more from the inside with a shallower delivery."
            : path > 2
              ? "Your path is getting too in-to-out. Feel the chest rotating earlier through impact to prevent the club from getting stuck behind you."
              : "Strike quality is the biggest opportunity right now. Focus on centered contact and controlling low point.";

    return `${missText} ${faceText}\n${tip}`;
  };

  const message = getMissMessage(avgOffline, avgFace, swingPath).split("\n");

  return (
    <div
      className={styles.widget}
      id="miss-tendency"
      style={isEmpty ? { height: "fit-content" } : { height: "370.8px" }}
    >
      <div className={styles.header}>
        <p>Miss Tendency</p>
        {/* <IoInformationCircleOutline /> */}
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
                Left
              </p>
              <p className={styles.value}>
                {" "}
                {isEmpty ? "—" : avgOffline.toFixed(1)} yds
              </p>
              <p>
                Right
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
                  background: isEmpty ? "var(--lightgray)" : "var(--lightgray)",
                  border: "2px solid var(--bg)",
                }}
              />
            </div>

            <div className={styles.marks}>
              <div className={styles.mark}></div>
              <div className={styles.mark}></div>
              <div className={styles.mark}></div>
              <div className={styles.mark}></div>
              <div className={styles.mark}></div>
            </div>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <h3 style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
                {isEmpty ? "—" : avgOffline.toFixed(1)} yds
              </h3>
              <p>Offline</p>
            </div>
            <div className={styles.stat}>
              <h3 style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
                {isEmpty ? "—" : `${avgFace.toFixed(1)} deg`}
              </h3>
              <p>Face to Target</p>
            </div>
            <div className={styles.stat}>
              <h3 style={isEmpty ? { color: "var(--lightgray)" } : undefined}>
                {isEmpty ? "—" : `${swingPath.toFixed(1)} deg`}
              </h3>
              <p>Swing Path</p>
            </div>
          </div>
          <div className={isEmpty ? styles.emptyMessage : styles.message}>
            <p className={styles.title}>✦ AI analysis</p>

            <div className={styles.messageText}>
              {isEmpty ? (
                <p>
                  Your miss pattern analysis will appear here once you upload
                  session data.
                </p>
              ) : (
                <>
                  <span>{message[0]}</span>
                  <span>{message[1]}</span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {isEmpty && (
        <NoDataPlaceholderWidget
          icon={<GiArcheryTarget size={30} color="var(--lightgray)" />}
          title="Missing in action"
          message="Your miss tendency analysis will appear here once you upload session data."
        />
      )}
    </div>
  );
};

export default MissTendencyWidget;
