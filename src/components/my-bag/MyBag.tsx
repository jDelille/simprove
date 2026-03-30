import React from "react";
import styles from "./MyBag.module.scss";
import Button from "../button/Button";

type MyBagProps = {
  userId: string;
};

const MyBag: React.FC<MyBagProps> = ({ userId }) => {

    

  return (
    <div className={styles.myBag}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p>My Bag</p>
          <span>14 slots - 8 clubs set up</span>
        </div>
        <div className={styles.edit}>
            <Button variant="lessonCard" children="Edit Bag" />
        </div>
      </div>
      <ul>
        <li></li>
      </ul>
    </div>
  );
};

export default MyBag;
