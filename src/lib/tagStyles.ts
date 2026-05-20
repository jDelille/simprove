export const tagStyles = (styles: Record<string, string>, tag: string) => {
  switch (tag) {
    case "Beginner": return styles.beginnerTag;
    case "Intermediate": return styles.intermediateTag;
    case "Advanced": return styles.advancedTag;
    case "single": return styles.singleTag;
    case "multi": return styles.multiTag;
    case "course": return styles.courseTag;
    case "range": return styles.rangeTag;
    default: return "";
  }
};
