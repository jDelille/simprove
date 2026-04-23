"use client";

import { useRouter } from "next/navigation";
import { FaChevronRight } from "react-icons/fa";
import styles from "./Round.module.scss";

type RoundProps = {
    round?: any;
}

const Round = ({round}: RoundProps) => {
  const router = useRouter();

  return (
    <div className={styles.round}>
      <div className={styles.pageHeader}>
        <div className={styles.backBtn}>
          <button onClick={() => router.back()}>Rounds</button>{" "}
          <FaChevronRight size={8} /> 
        </div>
      </div>
    </div>
  );
};

export default Round;
