import React, { useState } from "react";
import styles from "./Card.module.scss";
import { Session } from "@/types/session";
import moment from "moment";
import { Shot } from "@/types/shot";
import { calculateAverages } from "@/lib/shots/averages";
import { useRouter } from "next/navigation";

type CardProps = {
  item: Session | any;
};
const Card = ({ item }: CardProps) => {
  const router = useRouter();
  let clubs;
  let averages;
  if (item.type === "session") {
    clubs = [...new Set(item.shots.map((shot: Shot) => shot.club))];
    averages = calculateAverages(item.shots || []);
  }
  const roundCard = (
    <div className={styles.content}>
      <div className={styles.roundIcon}>⛳</div>
      <div className={styles.text}>
        <p>
          {item.course_name}{" "}
          {/* <span className={styles.roundBadge}>{item.type}</span> */}
        </p>
        <span>
          {moment(item.round_begin).format("MMM DD")} · {item.tee_type} tees ·{" "}
          {item.hole_count} holes
        </span>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span>GIR</span>
          <p>{item.round_scores?.[0].greens_value_percent}%</p>
        </div>
        <div className={styles.stat}>
          <span>FIR</span>
          <p>{item.round_scores?.[0].fairways_value_percent}%</p>
        </div>
        <div className={styles.stat}>
          <span>PUTTS</span>
          <p>{item.round_scores?.[0].putts_value}</p>
        </div>
      </div>
    </div>
  );

  const sessionCard = (
    <div className={styles.content}>
      <div className={styles.sessionIcon}>🎯</div>
      <div className={styles.text}>
        <p>
          {item.session_name}{" "}
          {/* <span className={styles.sessionBadge}>{item.type}</span> */}
        </p>
        <span>
          {" "}
          {moment(item.session_date).format("MMM DD")} ·{" "}
          {clubs?.map((club) => club).join(", ")}
        </span>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span>SHOTS</span>
          <p>{item.shots?.length}</p>
        </div>
        <div className={styles.stat}>
          <span>BEST CARRY</span>
          <p>{averages?.longestCarry?.toFixed(0)}</p>
        </div>
        <div className={styles.stat}>
          <span>AVG OFFLINE</span>
          <p>{averages?.avgOffline?.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={styles.card}
      onClick={() =>
        router.push(
          `/activities/${(item.id)}?type=${item.type}`,
        )
      }
    >
      {item.type === "round" ? roundCard : sessionCard}
    </div>
  );
};

export default Card;
