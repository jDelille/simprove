export function getMissCause(
  faceToTarget: number,
  clubPath: number,
) {
  if (Math.abs(clubPath) > Math.abs(faceToTarget)) {
    return {
      title: "Swing Path",
      detail:
        clubPath > 0
          ? `In-to-out path of ${clubPath.toFixed(1)}°`
          : `Out-to-in path of ${Math.abs(clubPath).toFixed(1)}°`,
    };
  }

  return {
    title: "Club Face",
    detail:
      faceToTarget > 0
        ? `${faceToTarget.toFixed(1)}° open`
        : `${Math.abs(faceToTarget).toFixed(1)}° closed`,
  };
}