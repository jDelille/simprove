import { RANKS } from "./constants";

export function getRankFromPoints(points: number) {
  return [...RANKS]
    .reverse()
    .find(r => points >= r.min) ?? RANKS[0];
}