// src/components/UserStats.js
import React from 'react';
// import api from './services/api';
import styles from './UserStats.module.css';

function UserStats({ slotUsage, totalSlots, storageUsage, totalStorage }) {
    return (
        <div className={styles.statsContainer}>
            <h3>Your Stats</h3>
            <p>Slots Used: {slotUsage} / {totalSlots}</p>
            <p>Storage Used: {storageUsage}MB / {totalStorage}MB</p>
        </div>
    );
}

export default UserStats;
