"use client";

import useModal from "@/hooks/useModal";
import styles from "./AnnouncementBar.module.scss";
import { LuArrowUpRight } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useState } from "react";

const AnnouncementBar = ({ hasActivities }: { hasActivities: boolean }) => {
  const { openModal } = useModal();
  const [hidden, setHidden] = useState(false);

  if (hasActivities || hidden) {
    return null;
  }

  return (
    <div className={styles.announcementBar}>
      <div className={styles.content}>
        
        <div className={styles.text}>
          <div className={styles.announcementIcon}></div>
          Add a round or sync via the simprove
          extension to get started.
        </div>
        <button
          className={styles.announcementButton}
          onClick={() => openModal("upload")}
        >
          Add an activity <LuArrowUpRight />
        </button>
      </div>

      <IoClose onClick={() => setHidden(true)} className={styles.close} />
    </div>
  );
};

export default AnnouncementBar;
