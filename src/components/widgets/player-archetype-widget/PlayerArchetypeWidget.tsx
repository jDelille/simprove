import { Round } from "@/types/round";
import { getArchetype } from "@/lib/archetypes/getArchetype";
import { defaultArchetypes } from "@/lib/archetypes/defaultArchetypes";
import { statColors } from "@/lib/colors/statColors";
import { BsPersonLinesFill } from "react-icons/bs";
import NoDataPlaceholderWidget from "@/components/ui/no-data-placeholder-widget/NoDataPlaceholderWidget";
import styles from "./PlayerArchetypeWidget.module.scss";

type PlayerArchetypeWidgetProps = {
  rounds: Round[];
};

const PlayerArchetypeWidget = ({ rounds }: PlayerArchetypeWidgetProps) => {

  const hasNoRounds = rounds.length === 0;

  if (hasNoRounds) {
    return (
      <div className={styles.playerArchetypeWidget} id="player-archetype">
        <div className={styles.header}>
          <p>Player Archetype</p>
        </div>
        <div className={styles.content}>
          <NoDataPlaceholderWidget
            icon={<BsPersonLinesFill size={30} color="var(--lightgray)" />}
            title="No rounds played"
            message="Your player archetype will be revealed once you upload round data."
          />
        </div>
      </div>
    );
  }

  const scores = rounds.map((round) => round.round_scores[0]);

  const avgDriving =
    scores.reduce((sum, score) => {
      return sum + score?.fairways_value_percent;
    }, 0) / scores.length;

  const avgApproach =
    scores.reduce((sum, score) => {
      return sum + score?.greens_value_percent;
    }, 0) / scores.length;

  const avgShortGame =
    scores.reduce((sum, score) => {
      const penalties =
        score?.bogey + score?.double_bogey * 1.5 + score?.other * 2;

      const bogeyAvoidance = Math.max(0, 100 - penalties * 8);

      const shortGame =
        score?.sand_saves_value_percent * 0.7 + bogeyAvoidance * 0.3;

      return sum + shortGame;
    }, 0) / scores.length;

  const calculatePutting = (score: any) => {
    const putts = score?.putts_value;
    const normalized = 100 - ((putts - 18) / 18) * 100;
    return Math.max(0, Math.min(100, normalized));
  };

  const avgPutting =
    scores.reduce((sum, score) => {
      return sum + calculatePutting(score);
    }, 0) / scores.length;

  const playerStats = {
    driving: avgDriving,
    approach: avgApproach,
    shortGame: avgShortGame,
    putting: avgPutting,
  };

  const archetype = getArchetype(playerStats, defaultArchetypes);

  return (
    <div className={styles.playerArchetypeWidget} id="player-archetype">
      <div className={styles.header}>
        <p>Player Archetype</p>
      </div>
      <div className={styles.content}>
        <p className={styles.archetypeName}>{archetype.name}</p>
        <p className={styles.archetypeDetails}>{archetype.description}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.label}>Driving</p>
            <div className={styles.statBar}>
              <div
                className={styles.statFill}
                style={{
                  width: `${avgDriving}%`,
                  backgroundColor: statColors.driving,
                }}
              ></div>
            </div>
            <p className={styles.statValue}>{Math.round(avgDriving)}%</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.label}>Approach</p>
            <div className={styles.statBar}>
              <div
                className={styles.statFill}
                style={{ width: `${avgApproach}%`, backgroundColor: statColors.approach }}
              ></div>
            </div>
            <p className={styles.statValue}>{Math.round(avgApproach)}%</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.label}>Short Game</p>
            <div className={styles.statBar}>
              <div
                className={styles.statFill}
                style={{ width: `${avgShortGame}%`, backgroundColor: statColors.shortGame }}
              ></div>
            </div>
            <p className={styles.statValue}>{Math.round(avgShortGame)}%</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.label}>Putting</p>
            <div className={styles.statBar}>
              <div
                className={styles.statFill}
                style={{ width: `${avgPutting}%`, backgroundColor: statColors.putting }}
              ></div>
            </div>
            <p className={styles.statValue}>{Math.round(avgPutting)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerArchetypeWidget;
