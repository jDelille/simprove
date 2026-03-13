import React from 'react'
import styles from "./Avatar.module.scss";

type AvatarProps = {
  src?: string | null;
};

const Avatar: React.FC<AvatarProps> = ({src}) => {
  return (
    <div className={styles.avatar}>
      {src && <img src={src} alt="avatar" />}
    </div>
  )
}

export default Avatar