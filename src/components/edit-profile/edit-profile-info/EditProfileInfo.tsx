import React from "react";
import styles from "./EditProfileInfo.module.scss";
import { Profile } from "@/types/profile";

type EditProfileInfoProps = {
  profile: Profile;
};

const EditProfileInfo: React.FC<EditProfileInfoProps> = ({ profile }) => {

  return (
    <div className={styles.editProfileInfo}>
      <div className={styles.header}>
        <p>Profile Info</p>
      </div>
      <div className={styles.content}>
        {/* Add form fields here */}
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Display name</label>
            <input type="text" id="name" placeholder={profile?.display_name} />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder={profile?.username} />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="bio">Bio</label>
          <textarea id="bio" placeholder={profile?.bio || "Tell us about yourself"} />
        </div>
        <div className={styles.row}>
            <div className={styles.inputGroup}>
          <label htmlFor="location">Location</label>
          <input type="text" id="location" placeholder={profile?.location} />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="launchMonitor">Launch Monitor</label>
          <input type="text" id="launchMonitor" placeholder={profile?.launch_monitor} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileInfo;
