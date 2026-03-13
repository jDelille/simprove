import React from "react";
import styles from "./DangerZone.module.scss";
import Button from "@/components/button/Button";

const DangerZone = () => {
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
