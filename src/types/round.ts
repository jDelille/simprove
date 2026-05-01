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

  round_scores: any[]; // refine later
};