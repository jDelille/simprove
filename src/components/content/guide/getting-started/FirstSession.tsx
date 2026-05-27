import React from "react";
import styles from "../../Content.module.scss";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";

const RecordingYourFirstSession = () => {
  return (
    <div className={styles.content}>
      <p className={styles.description}>
        This guide explains how to record your first session in Simprove. 
        Choose the method that matches how you use GSPro.
      </p>

      {/* What a session is */}
      <div className={styles.row}>
        <h2>What is a session?</h2>
        <p>
          In Simprove, a session is any set of shots imported from GSPro.
          Once added, sessions become part of your performance history and are used
          to track improvement over time.
        </p>

        <ul>
          <li><strong>Practice range sessions:</strong> Shot data you export manually from GSPro</li>
          <li><strong>On-course rounds:</strong> Automatically synced using the Simprove Chrome extension</li>
        </ul>
      </div>

      {/* Choice cards */}
      <div className={styles.row}>
        <h2>Choose how you want to record your first session</h2>

        <div className={styles.cardGrid}>
          {/* Manual Upload */}
          <div className={styles.card}>
            <h3>Manual Upload (Range Session)</h3>
            <p>
              For practice sessions where you want full shot-by-shot analysis.
            </p>

            <ul>
              <li>1: Export your session from GSPro</li>
              <li>2: Upload it to Simprove</li>
              <li>3: View breakdown instantly</li>
            </ul>

            <Link
              href="/guide/import/manual-import"
              className={styles.primaryButton}
            >
              Upload first session
            </Link>
          </div>

          {/* Sync */}
          <div className={styles.card}>
            <h3>Sync On-Course Rounds</h3>
            <p>
              For automatically tracking rounds without manual uploads.
            </p>

            <ul>
              <li>1: Install Simprove Chrome extension</li>
              <li>2: Connect your GSPro account</li>
              <li>3: Sync rounds automatically</li>
            </ul>

            <Link
              href="/guide/import/sync-import"
              className={styles.primaryButton}
            >
              Set up syncing
            </Link>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className={styles.row}>
        <h2>What happens after your first session</h2>
        <ul>
          <li>Shots are grouped by club automatically</li>
          <li>Your performance trends start building</li>
          <li>Sessions appear in your dashboard history</li>
          <li>Insights begin updating as you add more data</li>
        </ul>
      </div>

      {/* Footer nav */}
      <div className={styles.footer}>
        <Link
          href={"/guide/getting-started/overview"}
          className={styles.navigateBack}
        >
          <FaChevronLeft className={styles.leftIcon} size={16} />
          <div className={styles.text}>
            <span>Previous</span>
            Overview
          </div>
        </Link>

        <Link
          href={"/guide/import/manual-import"}
          className={styles.navigate}
        >
          <div className={styles.text}>
            <span>Next</span>
            Manual Import
          </div>
          <FaChevronRight className={styles.icon} size={16} />
        </Link>
      </div>
    </div>
  );
};

export default RecordingYourFirstSession;