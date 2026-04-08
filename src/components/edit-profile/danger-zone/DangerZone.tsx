import React from "react";
import styles from "./DangerZone.module.scss";
import Button from "@/components/button/Button";
import { Profile } from "@/types/profile";

type DangerZoneProps = {
  profile: Profile;
};

const DangerZone = ({ profile }: DangerZoneProps) => {

  if (profile.is_demo_account) {
    return null;
  }

  return (
    <div className={styles.dangerZone}>
      <div className={styles.header}>
        <p>Danger Zone</p>
        <span>These actions are permanent and cannot be undone.</span>
      </div>
      <div className={styles.content}>
        <Button variant="secondaryDanger" children="Delete all session data" />
        <Button variant="danger" children="Delete account" />
      </div>
    </div>
  );
};

export default DangerZone;
