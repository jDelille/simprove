"use client";

import { Session } from "@/types/session";
import moment from "moment";
import { Shot } from "@/types/shot";
import { calculateAverages } from "@/lib/shots/averages";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import usePopup from "@/hooks/usePopup";
import Popup from "@/components/ui/popup/Popup";
import styles from "./Card.module.scss";
import Button from "@/components/ui/button/Button";
import { deleteSession } from "@/services/sessions/deleteSession";
import { deleteRound } from "@/services/rounds/deleteRound";

type CardProps = {
  item: Session | any;
  isDemoAccount: boolean;
};
const Card = ({ item, isDemoAccount }: CardProps) => {
  const router = useRouter();
  const { popups, openPopup, closePopup } = usePopup();

  let clubs;
  let averages;
  if (item.type === "session") {
    clubs = [...new Set(item.shots.map((shot: Shot) => shot.club))];
    averages = calculateAverages(item.shots || []);
  }

  const popupKey = `delete-${item.id}`;

  const openDeletePopup = (e: any) => {
    e.stopPropagation();
    openPopup(popupKey);
  };

  const handleClosePopup = (e: any) => {
    e.stopPropagation();
    closePopup(popupKey);
  };

  const handleDeleteActivity = async (e: any) => {
    e.stopPropagation();

    if (isDemoAccount) {
      return;
    }

    try {
      if (item.round_begin) {
        await deleteRound({
          roundId: item.id,
        });
      } else {
        await deleteSession({
          sessionId: item.id,
          storagePath: item.storage_path,
        });
      }

      closePopup(popupKey);
    } catch (error) {
      console.error(error);
    }
  };

  const popupBody = (
    <div className={styles.popupBody}>
      <p className={styles.title}>Delete activity?</p>
      <p className={styles.description}>
        This action can't be undone. All data associated with this activity will
        be permanently removed.
      </p>
      <div className={styles.preview}>
        <p className={styles.name}>{item.course_name || item.session_name}</p>
        {item.round_begin ? (
          <span>
            {" "}
            {moment(item.round_begin).format("MMM DD")} · {item.tee_type} tees ·{" "}
            {item.hole_count} holes
          </span>
        ) : (
          <span>
            {" "}
            {moment(item.session_date).format("MMM DD")} ·{" "}
            {clubs?.map((club) => club).join(", ")}
          </span>
        )}
      </div>
      <div className={styles.buttons}>
        <Button
          onClick={(e) => handleClosePopup(e)}
          children={"Cancel"}
          variant="lessonCard"
        />
        <Button
          onClick={(e) => handleDeleteActivity(e)}
          children={"N/A for demo"}
          variant="dangerOutline"
        />
      </div>
    </div>
  );

  const roundCard = (
    <div className={styles.content}>
      <div className={styles.info}>
        <div className={styles.roundIcon}>⛳</div>

        <div className={styles.text}>
          <p>
            {item.course_name}
            {/* <span className={styles.roundBadge}>{item.type}</span> */}
          </p>
          <span>
            {moment(item.round_begin).format("MMM DD")} · {item.tee_type} tees ·{" "}
            {item.hole_count} holes
          </span>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span>GIR</span>
          <p>{item.round_scores?.[0]?.greens_value_percent}%</p>
        </div>
        <div className={styles.stat}>
          <span>FIR</span>
          <p>{item.round_scores?.[0]?.fairways_value_percent}%</p>
        </div>
        <div className={styles.stat}>
          <span>PUTTS</span>
          <p>{item.round_scores?.[0]?.putts_value}</p>
        </div>
      </div>
        <div className={styles.delete}>
          <MdDeleteOutline
            color="var(--lightgray)"
            onClick={(e) => openDeletePopup(e)}
          />
        </div>
    </div>
  );

  const sessionCard = (
    <div className={styles.content}>
      <div className={styles.info}>
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
      <div className={styles.delete}>
        <MdDeleteOutline
          color="var(--lightgray)"
          onClick={(e) => openDeletePopup(e)}
        />
      </div>
    </div>
  );

  return (
    <div
      className={styles.card}
      onClick={() => router.push(`/activities/${item.id}?type=${item.type}`)}
    >
      {item.type === "round" ? roundCard : sessionCard}

      <Popup isOpen={popups[popupKey] || false} title="" body={popupBody} />
    </div>
  );
};

export default Card;
