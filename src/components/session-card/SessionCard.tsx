import { activityDateFormat } from "@/lib/format-date/ActivityDateFormat";
import styles from "./SessionCard.module.scss";
import moment from "moment";
import Stat from "./stat/Stat";
import { useRouter } from "next/navigation";

type SessionCardProps = {
  session: any; // Replace 'any' with the actual type
};

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const date = moment(session.session_date).format("MMM D, YYYY");

  const router = useRouter();

  return (
    <div className={styles.sessionCard} onClick={() => router.push(`/session/${session.id}`)}>
      <div className={styles.title}>
        <h3 className={styles.name}>{session.session_name}</h3>
        <div className={styles.info}>
          <p className={styles.date}>{date}</p>
          <p>-</p>
          <p>{session?.shots.length} shots</p>
        </div>
      </div>
      <div className={styles.stats}>
        <Stat label="Best Carry" value={289} metric="yards" />
        <Stat label="Ball Speed" value={156} metric="mph" />
        <Stat label="Best Carry" value={289} metric="yards" />
        <Stat label="Ball Speed" value={156} metric="mph" />
      </div>
    </div>
  );
};

export default SessionCard;
