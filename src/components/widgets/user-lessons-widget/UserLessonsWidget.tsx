import React from "react";
import styles from "./UserLessonsWidget.module.scss";

type LessonProps = {
  current_week: number;
  id: string;
  lesson_id: string;
  started_at: string;
  status: string;
  user_id: string;
  lessons: any;
};

type UserLessonsWidgetProps = {
  lessons: {
    userLessons: LessonProps[];
  };
};

const UserLessonsWidget: React.FC<UserLessonsWidgetProps> = ({ lessons }) => {
  const lessonSummary = lessons.userLessons;


  const lessonDetails = lessonSummary.map((lesson) => ({
    lesson_id: lesson.lessons.lesson_id,
    status: lesson.status,
    started_at: lesson.started_at,
    total_points: lesson.lessons.total_points,
    lesson_difficulty: lesson.lessons.lesson_difficulty,
    lesson_name: lesson.lessons.lesson_name,
  }));

  return (
    <div className={styles.userLessonsWidget}>
      <div className={styles.header}>
        <p>Lessons</p>
      </div>
      <div className={styles.content}>
        {lessonDetails.map((lesson) => (
          <div key={lesson.lesson_id} className={styles.lessonItem}>
            <div className={styles.top}>
              <p>{lesson.lesson_name}</p>
              <p className={styles.status}>{lesson.status}</p>
            </div>
            <div className={styles.bottom}>
              <div className={styles.text}>
                <p>{lesson.lesson_difficulty}</p>
                <p>·</p>
                <p>{lesson.total_points} pts earned</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserLessonsWidget;
