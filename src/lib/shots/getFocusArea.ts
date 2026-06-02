export function getFocusArea(missCause: string) {
  switch (missCause) {
    case "Swing Path":
      return {
        title: "Path Control",
        description: "Mission available",
      };

    case "Club Face":
      return {
        title: "Face Control",
        description: "Mission available",
      };

    case "Ball Strike":
      return {
        title: "Center Contact",
        description: "Mission available",
      };

    case "Attack Angle":
      return {
        title: "Low Point Control",
        description: "Mission available",
      };

    default:
      return {
        title: "Consistency",
        description: "Mission available",
      };
  }
}