export type RoundScore = {
  id: string;
  round_id: string;
  round_key: string;
  user_id: string;

  albatross: number;
  birdie: number;
  bogey: number;
  double_bogey: number;
  eagle: number;
  other: number;
  par: number;

  par3_average: number;
  par4_average: number;
  par5_average: number;

  fairways_target: number;
  fairways_target_percent: number;
  fairways_value: number;
  fairways_value_percent: number;

  greens_target: number;
  greens_target_percent: number;
  greens_value: number;
  greens_value_percent: number;

  putts_target: number;
  putts_value: number;

  sand_saves_target: number;
  sand_saves_value: number;
  sand_saves_value_percent: number;

  driving_distance_longest: number;

  round_begin: string;
  created_at: string;
  updated_at: string;
};


export type Round = {
  id: string;
  user_id: string;

  course_name: string;
  control_type: "Simulator" | string;
  round_type: "Stroke Play" | string;

  tee_type: string;

  hole_count: number;
  par: number;
  rating: number;
  slope: number;

  total: string;

  round_begin: string;
  created_at: string;
  updated_at: string;

  round_key: string;

  hidden_from_stats: boolean;

  round_scores: RoundScore[];
};