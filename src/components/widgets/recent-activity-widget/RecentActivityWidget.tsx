"use client";

import React from "react";
import styles from "./RecentActivityWidget.module.scss";
import { useActivities } from "@/hooks/useActivities";
import { activityDateFormat } from "@/lib/format-date/ActivityDateFormat";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaTrophy } from "react-icons/fa";
import { useRouter } from "next/navigation";

type RecentActivityWidgetProps = {
  userId: string;
};

const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = (props) => {
  const { data, isLoading } = useActivities(props.userId);
  const router = useRouter();

  const { latestThreeActivities = [] } = data || {};

  const isEmpty = !latestThreeActivities.length && !isLoading;

  return (
    <div className={styles.widget}>
      <div className={styles.header}>
        <p>Recent Activity</p>
      </div>

      {isLoading && <p>Loading...</p>}

      {isEmpty && !isLoading && (
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

      {!isEmpty && !isLoading && (
        <ul>
          {latestThreeActivities.map((activity: any) => (
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
                    style={{ backgroundColor: "#FFF8E1" }}
                  >
                    <FaTrophy color="#f7c04a" size={20} />
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
