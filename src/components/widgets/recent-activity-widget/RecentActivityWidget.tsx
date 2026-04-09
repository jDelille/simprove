"use client";

import React from "react";
import styles from "./RecentActivityWidget.module.scss";
import { activityDateFormat } from "@/lib/format-date/ActivityDateFormat";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { RecentActivity } from "@/types/recentActivity";

type RecentActivityWidgetProps = {
  userId: string;
  recentActivity?: RecentActivity[];
};

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = (props) => {
  const router = useRouter();
  const data = props.recentActivity

  const isEmpty = !data || data.length === 0;

  return (
    <div className={styles.widget} id="recent-activity">
      <div className={styles.header}>
        <p>Recent Activity</p>
      </div>

      {/* {isLoading && <p>Loading...</p>} */}

      {isEmpty && (
        <div className={styles.empty}>
          {/* <div className={styles.icon}>
            <p>⛳</p>
          </div> */}
          <p>
            No activity yet
            <br />
            Your recent activity will appear here as you use the app and earn badges!
          </p>
        </div>
      )}

      {!isEmpty &&  (
        <ul>
          {data.map((activity: any) => (
            <li key={activity.id}>
              {activity.type === "SESSION_CREATED" && (
                <div
                  className={styles.activity}
                  onClick={() => router.push(`/session/${activity.entity_id}`)}
                >
                  <div
                    className={styles.icon}
                    style={{
                      backgroundColor: "var(--green)",
                      border: "1px solid var(--greenBorder)",
                    }}
                  >
                    <MdOutlineFileUpload color="#2aaa55" size={20} />
                  </div>
                  <div className={styles.body}>
                    <p className={styles.title}>
                      {activity.title}{" "}
                      <span className={styles.date}>
                        {activityDateFormat(activity.created_at)} ago
                      </span>
                    </p>
                    <p className={styles.description}>{activity.description}</p>
                  </div>
                </div>
              )}

              {activity.type === "BADGE_EARNED" && (
                <div className={styles.activity}>
                  <div
                    className={styles.icon}
                    style={{ backgroundColor: "var(--lightYellow)", border: "1px solid var(--yellowBorder)" }}
                  >
                    <FaTrophy color="var(--yellowText)" size={16} />
                  </div>
                  <div className={styles.body}>
                    <div className={styles.title}>
                      <p className={styles.name}>{activity.title}</p>
                      <span className={styles.date}>
                        {activityDateFormat(activity.created_at)} ago
                      </span>
                    </div>
                    <p className={styles.description}>{activity.description}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivityWidget;
