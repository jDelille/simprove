import React from "react";
import styles from "./Avatar.module.scss";

type AvatarProps = {
  src?: string | null;
  size?: "xsmall" | "small" | "medium" | "large";
  initials?: string;
  color?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  size = "small",
  initials,
  color,
}) => {
  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={!src ? { backgroundColor: color || "#999" } : undefined}
    >
      {src ? (
        <img src={src} alt="avatar" />
      ) : (
        initials && <span className={styles.initials}>{initials}</span>
      )}
    </div>
  );
};

export default Avatar;