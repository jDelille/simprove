"use client";

import useModal from "@/hooks/useModal";
import styles from "./AnnouncementBar.module.scss";
import { LuArrowUpRight } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const AnnouncementBar = ({
  hasActivities,
  isDemoAccount,
}: {
  hasActivities: boolean;
  isDemoAccount: boolean | undefined;
}) => {
  const { openModal } = useModal();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/auth");

  const shouldHide =
    hasActivities || hidden || isDemoAccount === true || isAuthPage;
  if (shouldHide) return null;

  useEffect(() => {
    const saved = localStorage.getItem("announcement-hidden");
    if (saved === "true") setHidden(true);
  }, []);

  const handleClose = () => {
    setHidden(true);
    localStorage.setItem("announcement-hidden", "true");
  };

  return (
    <div className={styles.announcementBar}>
      <div className={styles.content}>
        <div className={styles.text}>
          <div className={styles.announcementIcon} aria-hidden="true"></div>
          Add a round or sync via the simprove extension to get started.
        </div>
        <button
          className={styles.announcementButton}
          onClick={() => openModal("upload")}
        >
          Add an activity <LuArrowUpRight />
        </button>
      </div>

      <IoClose onClick={handleClose} className={styles.close} />
    </div>
  );
};

export default AnnouncementBar;
