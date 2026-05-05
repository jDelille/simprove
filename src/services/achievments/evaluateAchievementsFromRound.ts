function getSessionStats(session: any) {
  const shots = session.shots ?? [];

  const totalShots = shots.length;

  const uniqueClubs = new Set(shots.map((s: any) => s.club)).size;

  const maxCarry = Math.max(...shots.map((s: any) => s.carry || 0));

  const avgCarry =
    shots.reduce((sum: number, s: any) => sum + (s.carry || 0), 0) /
    (totalShots || 1);

  const startedAtHour = new Date(session.session_date).getHours();

  return {
    totalShots,
    uniqueClubs,
    maxCarry,
    avgCarry,
    startedAtHour,
  };
}

export function evaluateAchievementsFromRound(stats: any) {
  const achievements: string[] = [];

  // Scoring
  if (stats.birdies >= 4) {
    achievements.push("four_of_a_kind");
  }

  if (stats.bogeys === 0 && stats.doubleBogeys === 0) {
    achievements.push("bogey_free");
  }

  if (stats.birdies > stats.bogeys + stats.doubleBogeys) {
    achievements.push("the_golden_ratio");
  }

  // Check consecutive holes for took_my_medicine
  if (stats.holes && Array.isArray(stats.holes)) {
    for (let i = 0; i < stats.holes.length - 1; i++) {
      const current = stats.holes[i];
      const next = stats.holes[i + 1];
      const currentScore = current.strokes - current.par;
      const nextScore = next.strokes - next.par;
      if (currentScore >= 2 && nextScore <= -1) {
        achievements.push("took_my_medicine");
        break;
      }
    }
  }

  // Ball striking
  if (stats.greensHit === stats.greensTotal) {
    achievements.push("gir_collector");
  }

  if (stats.fairwaysHit === stats.fairwaysTotal) {
    achievements.push("fir_collector");
  }

  const fairwayPct = stats.fairwaysHit / stats.fairwaysTotal;
  const girPct = stats.greensHit / stats.greensTotal;
  if (fairwayPct >= 0.8 && girPct >= 0.8) {
    achievements.push("both_barrels");
  }

  if (stats.sandSaves === stats.sandSavesTotal && stats.sandSavesTotal > 0) {
    achievements.push("golden_ferret");
  }

  if (stats.putts <= 26) {
    achievements.push("26_and_done");
  }

  // Lifetime — single round triggers
  if (stats.isPersonalBest) {
    achievements.push("thats_new");
  }

  return achievements;
}

export function evaluateAchievementsFromSession(session: any) {
  const stats = getSessionStats(session);

  const achievements: string[] = [];

  // Grinder (100+ shots)
  if (stats.totalShots >= 100) {
    achievements.push("grinder");
  }

  // Any Club, Any Time (6+ clubs)
  if (stats.uniqueClubs >= 6) {
    achievements.push("any_club_any_time");
  }

  // Long carry
  if (stats.maxCarry >= 280) {
    achievements.push("now_thats_a_number");
  }

  // Night Owl
  if (stats.startedAtHour >= 22) {
    achievements.push("night_owl");
  }

  return achievements;
}