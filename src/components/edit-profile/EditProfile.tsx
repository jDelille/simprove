"use client";

import { useState } from "react";
import styles from "./EditProfile.module.scss";
import SettingsNavWidget from "../widgets/settings-nav-widget/SettingsNavWidget";

const EditProfile = () => {
  const [selectedSection, setSelectedSection] = useState("Account");
  return (
    <div className={styles.editProfile}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Edit Profile</h1>
          <p>Manage your account, preferences, and privacy</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.row}>
            <SettingsNavWidget
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />
          </div>
        </div>
        <div className={styles.column}>
            {/* Profile pic */}
            {/* Profile info */}
            {/* Login and security */}
            {/* Danger zone (delete all sessions / account) */}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
