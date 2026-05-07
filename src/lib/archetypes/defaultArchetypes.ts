import { Archetype } from "./getArchetype";

export const defaultArchetypes: Archetype[] = [
  {
    name: "Green Whisperer",
    description:
      "Relies heavily on putting to keep scores low, thriving on the greens when the rest of the game holds steady.",
    match: (s) => {
      const putting = s.putting / 100;
      const shortGamePenalty = Math.max(0, (50 - s.shortGame) / 50);

      return putting * 0.7 + shortGamePenalty * 0.3;
    },
  },
  {
    name: "Fairway Technician",
    description:
      "Controls the course from tee to green with precise, repeatable ball striking.",
    match: (s) => {
      const driving = s.driving / 100;
      const approach = s.approach / 100;

      return driving * 0.5 + approach * 0.5;
    },
  },
  {
    name: "Escape Artist",
    description:
      "Saves rounds through elite recovery shots and creative short game play.",
    match: (s) => {
      const shortGame = s.shortGame / 100;
      const putting = s.putting / 100;

      return shortGame * 0.6 + putting * 0.4;
    },
  },
  {
    name: "Wildcard",
    description:
      "A streaky player capable of brilliant stretches and sudden drops in form.",
    match: (s) => {
      const values = [s.driving, s.approach, s.shortGame, s.putting];

      const spread = Math.max(...values) - Math.min(...values);

      return Math.min(1, spread / 40);
    },
  },
];
