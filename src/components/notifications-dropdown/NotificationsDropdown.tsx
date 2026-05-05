"use client";

import { useState } from "react";
import styles from "./NotificationsDropdown.module.scss";
import Link from "next/link";
import { Notification } from "@/types";
import moment from "moment";
import { markNotificationsRead } from "@/services/notifications/markNotificationsRead";
import { useRouter } from "next/navigation";
import { FaTrophy } from "react-icons/fa6";
import { IoGolf } from "react-icons/io5";

export type NotificationTab = "All" | "Activity" | "Achievements";

const TABS: NotificationTab[] = ["All", "Activity", "Achievements"];

const TAB_TYPE_MAP: Record<Exclude<NotificationTab, "All">, string[]> = {
  Achievements: ["achievement"],
  Activity: ["activity", "session"],
};

const NOTIFICATION_ICONS: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  achievement: {
    icon: <FaTrophy size={15} color="#f59e0b" />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  session: {
    icon: <IoGolf size={15} color="#3ecf8e" />,
    color: "#3ecf8e",
    bg: "rgba(62,207,142,0.1)",
  },
};

type Props = {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
  userId: string;
};

const NotificationsDropdown = ({
  notifications,
  onMarkAllRead,
  onMarkRead,
  userId,
}: Props) => {
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");
  const router = useRouter();

  const filtered =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) =>
          TAB_TYPE_MAP[activeTab].includes(n.entity_type),
        );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  console.log(notifications);

  const handleNotificationClick = async (id: string) => {
    await markNotificationsRead(userId);
    onMarkRead?.(id);
    router.refresh();
  };

  const getNotificationIcon = (type: string) => {
    return NOTIFICATION_ICONS[type];
  };

  return (
    <div className={styles.notificationsDropdown}>
      <div className={styles.header}>
        <div className={styles.top}>
          <p>Notifications</p>
          {unreadCount > 0 && (
            <div className={styles.number}>{unreadCount} new</div>
          )}
          <button onClick={onMarkAllRead}>Mark all read</button>
        </div>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.active : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <ul>
        {filtered.length === 0 ? (
          <li className={styles.empty}>No notifications</li>
        ) : (
          filtered.map((n) => {
            const notif = getNotificationIcon(n.entity_type);

            return (
              <li
                key={n.id}
                className={`${styles.item} ${!n.is_read ? styles.unread : ""}`}
                onClick={() => handleNotificationClick(n.id)}
              >
                <div className={styles.iconContainer}>
                  {/* <span className={!n.is_read ? styles.dot : styles.hideDot} /> */}
                  <div
                    className={styles.icon}
                    style={{
                      backgroundColor: notif?.bg,
                      borderColor: notif?.color + "33",
                    }}
                  >
                    {notif?.icon}
                  </div>
                </div>
                <div className={styles.content}>
                  <p className={styles.itemTitle}>{n.title}</p>
                  <span className={styles.itemDescription}>
                    {n.description}
                  </span>
                  <span className={styles.timestamp}>
                    {moment(n.created_at).fromNow()}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className={styles.footer}>
        <Link href="/notifications">View notification center</Link>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
