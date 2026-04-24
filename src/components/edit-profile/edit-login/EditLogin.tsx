import React from "react";
import { Profile } from "@/types/profile";
import Button from "@/components/ui/button/Button";
import styles from "./EditLogin.module.scss";

type EditLoginProps = {
  profile: Profile;
};

const EditLogin: React.FC<EditLoginProps> = ({ profile }) => {
  return (
    <div className={styles.editLogin}>
      <div className={styles.header}>
        <p>Edit Login</p>
      </div>
      <div className={styles.content}>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" placeholder={profile?.email} />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder={"Enter your password"} />
          </div>
          <Button variant="secondary" children="Change password" />
        </div>
        <div className={styles.row}>
            <Button variant="lessonCard" children="Save changes" />
        </div>
      </div>
    </div>
  );
};

export default EditLogin;
