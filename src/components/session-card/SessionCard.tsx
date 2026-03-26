import { activityDateFormat } from "@/lib/format-date/ActivityDateFormat";
import styles from "./SessionCard.module.scss";
import moment from "moment";
import { useRouter } from "next/navigation";
import { FaCheckSquare } from "react-icons/fa";
import { useState } from "react";

type SessionCardProps = {
  session: any; // Replace 'any' with the actual type
  averages: any; // Replace 'any' with the actual type for averages
  index: number;
  setSelectedSessions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSessions: string[];
};

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  averages,
  index,
  setSelectedSessions,
  selectedSessions,
}) => {
  const date = moment(session.session_date).format("MMM D, YYYY");
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecked(!isChecked);
    if (!isChecked) {
      setSelectedSessions([...selectedSessions, session.id]);
    } else {
      setSelectedSessions(selectedSessions.filter((id) => id !== session.id));
    }
  };

  return (
    <div
      className={styles.sessionCard}
      style={{ "--delay": `${index * 0.04}s` } as React.CSSProperties}
      onClick={() => router.push(`/session/${session.id}`)}
    >
      <div
        className={styles.checkBox}
        onClick={(e) => handleCheckboxClick(e)}
      >
        {isChecked && <FaCheckSquare color="var(--accent)" size={16} />}
      </div>
      <div className={styles.title}>
        <h3 className={styles.name}>{session.session_name}</h3>
        <div className={styles.info}>
          <p className={styles.date}>{date}</p>
        </div>
      </div>
      <div className={styles.stats}>
        <ul>
          <li>
            {session.shots?.length || 0} <span>shots</span>
          </li>
          <li>
            {averages.longestCarry
              ? `${averages.longestCarry?.toFixed(0)} `
              : "N/A"}
            <span>yds</span>
          </li>
          <li>
            {averages.peakBallSpeed
              ? `${averages.peakBallSpeed.toFixed(0)} `
              : "N/A"}
            <span>mph</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SessionCard;
