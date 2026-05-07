type PlayerStats = {
  driving: number;
  approach: number;
  shortGame: number;
  putting: number;
};

export type Archetype = {
  name: string;
  description: string;
  match: (s: PlayerStats) => number; // confidence 0–1
};

type ArchetypeResult = {
  name: string;
  description: string;
  confidence: number;
};

export function getArchetype(
  stats: PlayerStats,
  archetypes: Archetype[]
): ArchetypeResult {

  let best: ArchetypeResult = {
    name: "Balanced Player",
    description: "Even skill distribution across all areas.",
    confidence: 0,
  };

  for (const a of archetypes) {
    const confidence = a.match(stats);

    if (confidence > best.confidence) {
      best = {
        name: a.name,
        description: a.description,
        confidence,
      };
    }
  }

  return best;
}