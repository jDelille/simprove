"use client";

import React from 'react'
import styles from './FavoriteClubsWidget.module.scss';

const FavoriteClubsWidget = () => {

    const stats = [
        {id: 1, label: "7I", value: 842, avgYards: 163},
        {id: 2, label: "5I", value: 567, avgYards: 190},
        {id: 3, label: "3I", value: 123, avgYards: 210},
        {id: 4, label: "DR", value: 456, avgYards: 250},
        {id: 5, label: "PW", value: 789, avgYards: 120},
        {id: 6, label: "SW", value: 321, avgYards: 100},
        {id: 7, label: "LW", value: 654, avgYards: 80},
        {id: 8, label: "9I", value: 987, avgYards: 140},
    ]

  return (
    <div className={styles.widget}>
        <div className={styles.header}>
            <p>Favorite Clubs</p>
        </div>

        <div className={styles.content}>
            {stats.map(stat => (
                <div key={stat.id} className={styles.stat}>
                    <p className={styles.label}>{stat.label}</p>
                    <p className={styles.value}>{stat.value} <span>shots</span></p>
                    <p className={styles.avgYards}>{stat.avgYards} <span>avg yards</span></p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default FavoriteClubsWidget