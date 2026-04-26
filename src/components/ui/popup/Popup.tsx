import React, { ReactElement } from "react";
import styles from "./Popup.module.scss";
import { useTheme } from "@/context/ThemeContext";
type PopupProps = {
  isOpen: boolean;
  body: ReactElement;
  title: string;
  description?: string;
};

const Popup: React.FC<PopupProps> = ({
  isOpen,
  body,
  title,
  description,
}) => {

  if (!isOpen) return null;

  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <div className={isDarkMode ? styles.overlayDark : styles.overlay}>
      <div className={styles.popup}>
        {description && <p>{description}</p>}
        {body}
      </div>
    </div>
  );
};

export default Popup;
