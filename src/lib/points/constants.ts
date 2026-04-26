export const POINTS = {
  session: {
    upload: 100,
  },
  round: {
    upload: 250,
  },
  lesson: {
    complete: 250,
    drillHit: 50,
  },
  streak: {
    weekly: 75,
    monthly: 300,
  },
  social: {
    firstFollower: 50,
  },
} as const;

export const RANKS = [
  { rank: "Bogey III",    min: 0     },
  { rank: "Bogey II",     min: 500   },
  { rank: "Bogey I",      min: 1000  },
  { rank: "Par III",      min: 1750  },
  { rank: "Par II",       min: 2750  },
  { rank: "Par I",        min: 4000  },
  { rank: "Birdie III",   min: 5500  },
  { rank: "Birdie II",    min: 7500  },
  { rank: "Birdie I",     min: 10000 },
  { rank: "Eagle III",    min: 13000 },
  { rank: "Eagle II",     min: 16500 },
  { rank: "Eagle I",      min: 20500 },
  { rank: "Albatross III",min: 25000 },
  { rank: "Albatross II", min: 31000 },
  { rank: "Albatross I",  min: 38000 },
  { rank: "Condor",       min: 50000 },
] as const;