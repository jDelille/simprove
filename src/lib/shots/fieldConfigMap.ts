import { Shot } from "@/types/shot";

export type ShotField = {
  key: string;
  label: string;
  unit?: string;
  section: "club" | "launch" | "spin" | "flight" | "distance" | "advanced";

  /** Optional visibility flag */
  visible?: boolean;
};

export const SHOT_FIELDS: ShotField[] = [
  { key: "club", label: "Club", section: "club" },

  // Launch / club info
  { key: "ballSpeed", label: "Ball Speed", unit: "mph", section: "launch" },
  { key: "carry", label: "Carry", unit: "yds", section: "distance" },
  { key: "totalDistance", label: "Total", unit: "yds", section: "distance" },
  { key: "offline", label: "Offline", unit: "yds", section: "distance" },
  { key: "path", label: "Path", unit: "deg", section: "club" },
  { key: "faceToPath", label: "Face to Path", unit: "deg", section: "club", visible: false },
  { key: "faceToTarget", label: "Face to Target", unit: "deg", section: "club", visible: false },
  { key: "distanceToPin", label: "Distance to Pin", unit: "", section: "distance" },

  // Spin
  { key: "backSpin", label: "Backspin", unit: "rpm", section: "spin" },
  { key: "sideSpin", label: "Sidespin", unit: "rpm", section: "spin" },
  { key: "rawSpinAxis", label: "Spin Axis", unit: "deg", section: "spin" },

  // Launch angles
  { key: "vla", label: "Launch (V)", unit: "deg", section: "launch" },
  { key: "hla", label: "Launch (H)", unit: "deg", section: "launch" },
  { key: "dynamicLoft", label: "Dynamic Loft", unit: "deg", section: "club" },

  // Flight
  { key: "avgPeakHeight", label: "Peak Height", unit: "ft", section: "flight" },
  { key: "decent", label: "Descent", unit: "deg", section: "flight" },

  // Advanced
  // { key: "rawCarryGame", label: "Carry (Game)", unit: "yds", section: "advanced" },
];

export const BREAKDOWN_FIELDS: ShotField[] = [
    { key: "club", label: "Club", section: "club" },
    { key: "shots", label: "Shots", section: "club" },
    { key: "avgCarry", label: "Avg Carry", unit: "yds", section: "distance" },
    { key: "ballSpeed", label: "Ball Speed", unit: "mph", section: "launch" },  
    { key: "avgOffline", label: "Avg Offline", unit: "yds", section: "distance" },
    { key: "avgBackSpin", label: "Avg Backspin", unit: "rpm", section: "spin" },    
    { key: "avgLaunch", label: "Launch Angle", unit: "deg", section: "launch" },  
    { key: "avgPeakHeight", label: "Peak Height", unit: "ft", section: "flight" },
    { key: "avgDescent", label: "Descent", unit: "deg", section: "flight" },
]