import React from "react";
import styles from "../../Content.module.scss";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const SyncRounds = () => {
  return (
    <div className={styles.content}>
      <p className={styles.description}>
        Sync your GSPro on-course rounds into Simprove using the Simprove Chrome
        extension.
      </p>

      {/* Overview */}
      <div className={styles.row}>
        <h2>How round syncing works</h2>

        <p>
          GSPro does not currently support exporting on-course round data
          directly. To solve this, Simprove uses a Chrome extension to securely
          sync your completed rounds into your account.
        </p>

        <p>
          Once synced, your rounds become part of your performance history
          alongside your practice sessions.
        </p>
      </div>

      {/* When to use */}
      <div className={styles.row}>
        <h2>When to use round syncing</h2>

        <ul>
          <li>You want automatic round imports</li>
          <li>You regularly play full on-course rounds in GSPro</li>
          <li>You want practice and round history combined together</li>
        </ul>
      </div>

      {/* Install extension */}
      <div className={styles.row}>
        <h2>Install the Simprove Chrome extension</h2>

        <ol>
          <li>Download and install the Simprove Chrome extension</li>
          <li>Open Simprove dashboard</li>
          <li>Open the sync menu from the navbar</li>
          <li>Copy your unique pairing key</li>
        </ol>
      </div>

      {/* Connect GSPro */}
      <div className={styles.row}>
        <h2>Connect your GSPro account</h2>

        <ol>
          <li>
            Visit <strong>portal.gsprogolf.com</strong>
          </li>
          <li>Sign into your GSPro account</li>
          <li>Open the Simprove Chrome extension</li>
          <li>Paste your pairing key into the extension</li>
          <li>Press the sync button</li>
        </ol>

        <p>
          The extension will securely retrieve your available round history and
          connect it to your Simprove account.
        </p>

        <div className={styles.imageContainer}>
          <Image
            src="/guide-imgs/extension3.png"
            alt="Simprove Chrome extension"
            width={0}
            height={0}
            sizes="100vw"
            className={styles.image}
          />
        </div>
      </div>

      {/* Import rounds */}
      <div className={styles.row}>
        <h2>Import your rounds</h2>

        <p>
          After syncing, your available rounds will appear inside the Simprove
          sync modal.
        </p>

        <ol>
          <li>Select the rounds you want to import</li>
          <li>Click the upload button</li>
          <li>Wait for processing to complete</li>
        </ol>

        <p>
          Imported rounds will automatically appear in your dashboard and be
          included in your long-term performance tracking.
        </p>

        <div className={styles.imageContainer}>
          <Image
            src="/guide-imgs/sync.png"
            alt="Syncing rounds into Simprove"
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
          <li>Make sure you are signed into the correct GSPro account</li>
          <li>Your pairing key is unique to your Simprove account</li>
          <li>You can sync additional rounds at any time</li>
        </ul>
      </div>

      {/* After sync */}
      <div className={styles.row}>
        <h2>What happens after syncing</h2>

        <ul>
          <li>Rounds are added to your session history</li>
          <li>Performance trends update automatically</li>
          <li>Round data is combined with practice session data</li>
          <li>Insights improve as more rounds are imported</li>
        </ul>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Link
          href={"/guide/import/manual-import"}
          className={styles.navigateBack}
        >
          <FaChevronLeft className={styles.leftIcon} size={16} />
          <div className={styles.text}>
            <span>Previous</span>
            Manual Import
          </div>
        </Link>

        <Link
          href={"/guide/getting-started/overview"}
          className={styles.navigate}
        >
          <div className={styles.text}>
            <span>Next</span>
            Overview
          </div>
          <FaChevronRight className={styles.icon} size={16} />
        </Link>
      </div>
    </div>
  );
};

export default SyncRounds;
