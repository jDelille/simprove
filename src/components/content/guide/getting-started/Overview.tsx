import React from "react";
import styles from "../../Content.module.scss";
import { IoGolf } from "react-icons/io5";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const Overview = () => {
  return (
    <div className={styles.content}>
      <p className={styles.description}>
        Simprove helps you turn your GSPro simulator sessions into clear performance insights so you can track improvement and practice with purpose.
        Upload your sessions, and Simprove automatically organizes your shot data, highlights patterns, and tracks your progress over time.
      </p>

      <div className={styles.row}>
        <h2>About Simprove</h2>
        <p>
          Simprove is a performance tracking platform built for golf simulator players who want to get more out of every session.
          By combining your range sessions and on-course rounds in one place, Simprove transforms raw shot data into structured insights
          so you can understand your tendencies, track meaningful trends, and measure real improvement over time.
        </p>

        <p>
          Whether you're working on a specific club or trying to build consistency across your entire bag, Simprove helps you identify what actually matters in your game and focus your practice where it counts.
        </p>
      </div>

      <div className={styles.row}>
        <h2>Getting around the docs</h2>
        <p>
          Use this documentation to quickly find answers and learn how to get the most out of Simprove:
        </p>

        <ul>
          <li>
            <strong>Sidebar:</strong> Browse features and guides by category.
          </li>
          <li>
            <strong>Search:</strong> Find specific topics like uploads, analytics, or troubleshooting.
          </li>
          <li>
            <strong>Next / Previous:</strong> Move step-by-step through the setup flow.
          </li>
        </ul>
      </div>

      <div className={styles.row}>
        <div className={styles.disclaimer}>
          <div className={styles.icon}>
            <IoGolf color="var(--greenText)" size={16} />
          </div>
          <p>
            Simprove currently supports GSPro data only. This includes both practice range sessions and on-course round exports.
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <Link
          href={"/guide/getting-started/first-session"}
          className={styles.navigate}
        >
          <div className={styles.text}>
            <span>Next</span>
            Upload your first session
          </div>
          <FaChevronRight className={styles.icon} size={16} />
        </Link>
      </div>
    </div>
  );
};

export default Overview;