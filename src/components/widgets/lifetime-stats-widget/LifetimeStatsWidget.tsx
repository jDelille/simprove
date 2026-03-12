"use client";

import React from 'react'
import styles from './LifetimeStatsWidget.module.scss';

const LifetimeStatsWidget = () => {

    const stats = [
        {id: 1, label: "Total Shots", value: 1234, metric: null},
        {id: 2, label: "Sessions", value: 567, metric: null},
        {id: 3, label: "Longest Carry", value: "300", metric: "yds"},
        {id: 4, label: "Peak Ball Speed", value: "150", metric: "mph"},
        {id: 5, label: "Tightest Offline", value: "±5", metric: "yds"},
        {id: 6, label: "Favorite Club", value: "7I", metric: null}
    ]

  return (
    <div className={styles.widget}>
        <div className={styles.header}>
            <p>Lifetime Stats</p>
        </div>

        <div className={styles.content}>
            {stats.map(stat => (
                <div key={stat.id} className={styles.stat}>
                    <p className={styles.label}>{stat.label}</p>
                    <p className={styles.value}>{stat.value} <span>{stat.metric}</span></p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default LifetimeStatsWidget