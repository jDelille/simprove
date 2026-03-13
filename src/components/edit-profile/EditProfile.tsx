"use client";

import { useState } from "react";
import styles from "./EditProfile.module.scss";
import SettingsNavWidget from "../widgets/settings-nav-widget/SettingsNavWidget";
import EditAvatar from "./edit-avatar/EditAvatar";
import EditProfileInfo from "./edit-profile-info/EditProfileInfo";
import EditLogin from "./edit-login/EditLogin";
import DangerZone from "./danger-zone/DangerZone";
import { useUser } from "@/hooks/useUser";

const EditProfile = () => {
  const [selectedSection, setSelectedSection] = useState("Account");
  const {user, profile} = useUser();

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
            <EditAvatar avatar={profile?.avatar_path} />
            <EditProfileInfo profile={profile} />
            <EditLogin profile={profile}/>
            <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
