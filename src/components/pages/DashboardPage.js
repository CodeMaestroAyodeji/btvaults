// src/pages/DashboardPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FileManagement from '../FileManagement';
import SubscriptionInfo from '../SubscriptionInfo';
import UserStats from '../UserStats';
import TorrentManagement from '../TorrentManagement';
import styles from './DashboardPage.module.css';

function DashboardPage() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const plans = [
        { id: 1, name: "Free", price: 0, maxStorage: 500, maxSlots: 1, downloadSpeed: "500kbps", expiry: "3650 days" },
        { id: 2, name: "Premium", price: 10, maxStorage: 2000, maxSlots: 5, downloadSpeed: "5Mbps", expiry: "30 days" },
        { id: 3, name: "Pro", price: 25, maxStorage: 5000, maxSlots: 10, downloadSpeed: "Full Speed", expiry: "30 days" },
    ];

    const [currentPlan, setCurrentPlan] = useState(plans[0]);
    const [files, setFiles] = useState([
        { id: 1, name: 'example1.zip', size: 100, status: 'Completed' },
        { id: 2, name: 'example2.zip', size: 200, status: 'Completed' }
    ]);

    const slotUsage = files.length;
    const storageUsage = files.reduce((total, file) => total + file.size, 0);

    return (
        <div className={`container ${styles.dashboard}`}>
            <div className="d-flex justify-content-between align-items-center">
                <h2>Welcome to Your Dashboard</h2>
                <div>
                    <Link to="/profile-settings" className="btn btn-secondary me-2">Profile Settings</Link>
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
            </div>
            <UserStats 
                slotUsage={slotUsage} 
                totalSlots={currentPlan.maxSlots} 
                storageUsage={storageUsage} 
                totalStorage={currentPlan.maxStorage} 
            />
            <SubscriptionInfo 
                currentPlan={currentPlan} 
                plans={plans} 
                setCurrentPlan={setCurrentPlan} 
            />
            <TorrentManagement files={files} setFiles={setFiles} />
            <FileManagement files={files} setFiles={setFiles} />
        </div>
    );
}

export default DashboardPage;
