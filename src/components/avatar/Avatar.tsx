import React from 'react'
import styles from "./Avatar.module.scss";
import { FaChevronDown } from "react-icons/fa6";

type AvatarProps = {
  src?: string | null;
  size?: "small" | "medium" | "large";
  initials?: string;
};

const Avatar: React.FC<AvatarProps> = ({src, size = "small", initials}) => {

  console.log(src)
  return (
    <div className={styles.avatar + " " + styles[size]} >
      {src && <img src={src} alt="avatar" /> }
      {!src && initials && <div className={styles.initials}>{initials}</div>}
    </div>
    
  )
}

export default Avatar