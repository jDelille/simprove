import React from 'react'
import styles from "./Avatar.module.scss";
import { FaChevronDown } from "react-icons/fa6";

type AvatarProps = {
  src?: string | null;
  size?: "small" | "medium" | "large";
};

const Avatar: React.FC<AvatarProps> = ({src, size = "small"}) => {
  return (
    <div className={styles.avatar + " " + styles[size]} >
      {src && <img src={src} alt="avatar" /> }
    </div>
    
  )
}

export default Avatar