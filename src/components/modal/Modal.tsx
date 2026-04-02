import React, { ReactElement } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useTheme } from "@/context/ThemeContext";
import styles from "./Modal.module.scss";

type ModalProps = {
  isOpen: boolean;
  body: ReactElement;
  onClose: () => void;
  title: string;
  description?: string;
  isLessonPlan?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  body,
  onClose,
  title,
  description,
  isLessonPlan,
}) => {
  if (!isOpen) return null;

  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  const lessonPlanModalBody = (
    <div className={styles.lessonPlanBody}>{body}</div>
  );

  const modalBody = (
    <>
      <div className={styles.modalHeader}>
        <div className={styles.title}>
          <h2>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.close}>
          <div className={styles.iconBg} onClick={onClose}>
            <IoCloseOutline size={18} />
          </div>
        </div>
      </div>
      <div className={styles.body}>{body}</div>
    </>
  );

  return (
    <div className={isDarkMode ? styles.overlayDark : styles.overlay}>
      <div className={styles.modal}>
        {isLessonPlan ? lessonPlanModalBody : modalBody}
      </div>
    </div>
  );
};

export default Modal;
