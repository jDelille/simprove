import styles from "./Achievements.module.scss";
import { Acheievement } from "@/types";

type AchievementsProps = {
  achievements: Acheievement[];
  userAchievements: any[];
  globalPercentage: any[];
};

const Achievements = ({
  achievements,
  userAchievements,
  globalPercentage,
}: AchievementsProps) => {
  const globalMap = Object.fromEntries(
    globalPercentage.map((g) => [g.achievementId, g.percentage]),
  );

  const userSet = new Set(userAchievements.map((ua) => ua.achievement_id));

  return (
    <div className={styles.achievements}>
      <div className={styles.pageHeader}>
        <div className={styles.title}>
          <h1>Achievements</h1>
          <p>
            View your achievements and compare against the global leaderboard
          </p>
        </div>
      </div>

      <ul>
        {achievements.map((a) => {
          const unlocked = userSet.has(a.id);
          const globalPct = globalMap[a.id] ?? 0;

          return (
            <li
              className={styles.card}
              key={a.id}
              style={{
                opacity: unlocked ? 1 : 0.5,
              }}
            >
              <div className={unlocked ? styles.unlocked : styles.icon}>
                <img src={`/achievements/${a.key}.png`} />
              </div>

              <div className={styles.name}>
                <h2>{a.name}</h2>

                <p>{a.description}</p>

                <small>{globalPct.toFixed(1)}% of players have this achievement</small>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Achievements;
