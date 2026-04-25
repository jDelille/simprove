type Params = {
    activity: any;
}

export const useRound = ({ activity }: Params) => {
  const scores = activity.round_scores?.[0] || null;

  const calculateSide = (holes: any[]) => {
    return holes.reduce(
      (acc, h) => {
        const strokes = h.strokes ?? 0;
        const par = h.par ?? 0;

        acc.strokes += strokes;
        acc.par += par;

        return acc;
      },
      { strokes: 0, par: 0 }
    );
  };

  const front9 = activity.round_holes.filter(
    (h: any) => h.hole_number >= 1 && h.hole_number <= 9
  );

  const back9 = activity.round_holes.filter(
    (h: any) => h.hole_number >= 10 && h.hole_number <= 18
  );

  const front = calculateSide(front9);
  const back = calculateSide(back9);

  return {
    scores,

    frontScore: front.strokes,
    frontPar: front.par,
    frontOverPar: front.strokes - front.par,

    backScore: back.strokes,
    backPar: back.par,
    backOverPar: back.strokes - back.par,
  };
};