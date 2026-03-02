import React from "react";
import styles from "./Button.module.scss";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant: "primary" | "secondary";
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
