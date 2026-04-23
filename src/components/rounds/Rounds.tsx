import React from "react";
import styles from "./Rounds.module.scss";

type RoundsProps = {
  rounds: any;
};

const Rounds = ({ rounds }: RoundsProps) => {
  console.log(rounds);

  return (
    <div className={styles.rounds}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Rounds</h1>
          {rounds.length > 0 ? (
            <p>
              {rounds.length || 0} rounds
            </p>
          ) : (
            <p>No rounds tracked yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rounds;
