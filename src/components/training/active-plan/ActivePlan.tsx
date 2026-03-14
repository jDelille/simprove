import React from 'react'
import styles from "./ActivePlan.module.scss"
import { Lesson } from '@/types/lesson'

type ActivePlanProps = {
    lesson: Lesson
}

const ActivePlan: React.FC<ActivePlanProps> = ({ lesson }) => {

    console.log(lesson);

  return (
    <div className={styles.activePlan}>
      <div className={styles.badges}>
        <div className={styles.badge}>Active Plan</div>
        <div className={styles.badge}>{lesson?.type}</div>
      </div>
      <div className={styles.header}>
        <p className={styles.name}>{lesson?.lesson_name}</p>
        <p className={styles.description}>{lesson?.lesson_description}</p>
      </div>

      <div className={styles.duration}>
        <p>Week</p>
      </div>
    </div>
  )
}

export default ActivePlan