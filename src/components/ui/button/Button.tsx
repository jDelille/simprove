import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  disabled?: boolean;
  variant:
    | "primary"
    | "secondary"
    | "upload"
    | "secondaryDanger"
    | "danger"
    | "dangerOutline"
    | "lessonCard";
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant, disabled }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
