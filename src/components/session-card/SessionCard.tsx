import { activityDateFormat } from "@/lib/format-date/ActivityDateFormat";
import styles from "./SessionCard.module.scss";
import moment from "moment";
import { useRouter } from "next/navigation";

type SessionCardProps = {
  session: any; // Replace 'any' with the actual type
  averages: any; // Replace 'any' with the actual type for averages
};

const SessionCard: React.FC<SessionCardProps> = ({ session, averages }) => {
  const date = moment(session.session_date).format("MMM D, YYYY");

  const router = useRouter();

  console.log(averages)

  return (
    <div className={styles.sessionCard} onClick={() => router.push(`/session/${session.id}`)}>
      <div className={styles.title}>
        <h3 className={styles.name}>{session.session_name}</h3>
        <div className={styles.info}>
          <p className={styles.date}>{date}</p>
        </div>
      </div>
      <div className={styles.stats}>
        <ul>
          <li>{session.shots?.length || 0}</li>
          <li>{averages.longestCarry ? `${averages.longestCarry?.toFixed(0)} yds` : "N/A"}</li>
          <li>{averages.peakBallSpeed ? `${averages.peakBallSpeed.toFixed(0)} mph` : "N/A"}</li>
          <li>{averages.mostUsedClub ? `${averages.mostUsedClub}` : "N/A"}</li>
        </ul>
      </div>
    </div>
  );
};

export default SessionCard;
