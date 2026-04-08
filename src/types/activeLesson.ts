type Summary = {
total: number;
    completed: number;
    active: number;
    pending: number;
}


export type ActiveLesson = {
  activeLesson: string | null;
  drills: any[] | null;
  drillsError: string | null;
  error: string | null;
  lessonDetails: any | null;
  lessonsError: string | null;
  summary: Summary | undefined;
};
