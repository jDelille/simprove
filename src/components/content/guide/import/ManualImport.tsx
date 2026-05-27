import React from "react";
import styles from "../../Content.module.scss";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const ManualUpload = () => {
  return (
    <div className={styles.content}>
      <p className={styles.description}>
        Upload a GSPro practice range session into Simprove to start tracking
        your shot performance and building your history.
      </p>

      {/* What this is */}
      <div className={styles.row}>
        <h2>Manual import overview</h2>
        <p>
          Manual import is used for practice range sessions exported directly
          from GSPro. This gives you full shot-by-shot analysis inside Simprove.
        </p>
      </div>

      {/* When to use */}
      <div className={styles.row}>
        <h2>When to use manual import</h2>
        <ul>
          <li>You just finished a GSPro practice session</li>
          <li>You want detailed shot-level breakdowns</li>
          <li>You are not using the Chrome extension for rounds</li>
        </ul>
      </div>

      {/* Steps */}
      <div className={styles.row}>
        <h2>How to export your GSPro session</h2>

        <ol>
          <li>Open GSPro after finishing your practice session</li>
          <li>Navigate to the session export option</li>
          <li>Download the session file to your computer</li>
        </ol>

        <div className={styles.imageContainer}>
          <Image
            src="/guide-imgs/export-gspro.png"
            alt="Export GSPro session"
            width={0}
            height={0}
            sizes="100vw"
            className={styles.image}
          />
        </div>
      </div>

      <div className={styles.row}>
        <h2>Upload your session to Simprove</h2>

        <ol>
          <li>Go to Simprove dashboard</li>
          <li>Click the upload button in the top navigation</li>
          <li>Name your session (e.g. “Driver Practice - Jan 20”)</li>
          <li>Select the exported GSPro file</li>
          <li>Click upload and wait for processing</li>
        </ol>

        <div className={styles.imageContainer}>
          <Image
            src="/guide-imgs/upload.png"
            alt="Upload modal in Simprove"
            width={0}
            height={0}
            sizes="100vw"
            className={styles.image}
          />
        </div>
      </div>

      {/* Tips */}
      <div className={styles.row}>
        <h2>Important tips</h2>
        <ul>
          <li>Always make sure the file is from a single session</li>
          <li>Do not rename or modify the exported file</li>
          <li>Make sure each shot includes club selection in GSPro</li>
        </ul>
      </div>

      {/* After upload */}
      <div className={styles.row}>
        <h2>What happens after upload</h2>
        <ul>
          <li>Your shots are automatically grouped by club</li>
          <li>Performance metrics are calculated instantly</li>
          <li>The session appears in your dashboard history</li>
          <li>Trends update as you add more sessions</li>
        </ul>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Link
          href={"/guide/getting-started/recording-your-first-session"}
          className={styles.navigateBack}
        >
          <FaChevronLeft className={styles.leftIcon} size={16} />
          <div className={styles.text}>
            <span>Previous</span>
            First Session
          </div>
        </Link>

        <Link
          href={"/guide/import/sync-import"}
          className={styles.navigate}
        >
          <div className={styles.text}>
            <span>Next</span>
            Sync Import
          </div>
          <FaChevronRight className={styles.icon} size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ManualUpload;