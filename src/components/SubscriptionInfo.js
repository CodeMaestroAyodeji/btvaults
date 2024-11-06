// src/components/SubscriptionInfo.js
import React, { useState, useEffect } from 'react';
import styles from './SubscriptionInfo.module.css';

function SubscriptionInfo({ currentPlan, plans, setCurrentPlan }) {
    const handlePlanChange = (e) => {
        const selectedPlan = plans.find(plan => plan.id === parseInt(e.target.value));
        setCurrentPlan(selectedPlan);
    };

    return (
        <div className={styles.subscriptionContainer}>
            <h3>Current Plan: {currentPlan.name}</h3>
            <p>Expires in: {currentPlan.expiry}</p>
            <p>Max Storage: {currentPlan.maxStorage}MB</p>
            <p>Download Speed: {currentPlan.downloadSpeed}</p>
            <p>Price: ${currentPlan.price}</p>

            {/* Plan Selection Dropdown */}
            <label>Change Plan:</label>
            <select onChange={handlePlanChange} value={currentPlan.id}>
                {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                        {plan.name} - ${plan.price}
                    </option>
                ))}
            </select>

            <button className="btn btn-primary mt-2" onClick={() => alert("Plan changed successfully!")}>
                Upgrade Plan
            </button>
        </div>
    );
}

export default SubscriptionInfo;
