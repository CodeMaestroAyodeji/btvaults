// src/pages/DashboardPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FileManagement from '../FileManagement';
import SubscriptionInfo from '../SubscriptionInfo';
import UserStats from '../UserStats';
import TorrentManagement from '../TorrentManagement';
import Notifications from '../Notifications';
import styles from './DashboardPage.module.css';

function DashboardPage() {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    
    // Define available subscription plans
    const plans = [
        { id: 1, name: "Free", price: 0, maxStorage: 500, maxSlots: 1, downloadSpeed: "500kbps", expiry: "3650 days" },
        { id: 2, name: "Premium", price: 10, maxStorage: 2000, maxSlots: 5, downloadSpeed: "5Mbps", expiry: "30 days" },
        { id: 3, name: "Pro", price: 25, maxStorage: 5000, maxSlots: 10, downloadSpeed: "Full Speed", expiry: "30 days" }
    ];

    const [currentPlan, setCurrentPlan] = useState(plans[0]); // Default to Free plan
    const [notifications, setNotifications] = useState([]);

    // Add a notification
    const addNotification = (message) => {
        setNotifications((prev) => [
            ...prev,
            { id: Date.now(), message },
        ]);
    };

    // Remove a notification
    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    // Trigger notification on download completion
    const handleDownloadComplete = (fileName) => {
        addNotification(`Download complete: ${fileName}`);
    };

    // Sample trigger for subscription reminder (for testing purposes)
    const handleSubscriptionReminder = () => {
        addNotification("Your subscription will expire soon. Please renew to avoid interruption.");
    };

    return (
        <div className={`container ${styles.dashboard}`}>
            <div className="d-flex justify-content-between align-items-center">
                <h2>Welcome to Your Dashboard</h2>
                <div>
                    <Link to="/profile-settings" className="btn btn-secondary me-2">Profile Settings</Link>
                    <button onClick={() => {
                        localStorage.removeItem('authToken');
                        navigate('/login');
                    }} className="btn btn-danger">Logout</button>
                </div>
            </div>

            {/* Pass notifications and removal function to Notifications component */}
            <Notifications notifications={notifications} removeNotification={removeNotification} />

            <UserStats 
                slotUsage={files.length} 
                totalSlots={currentPlan.maxSlots} 
                storageUsage={files.reduce((total, file) => total + file.size, 0)} 
                totalStorage={currentPlan.maxStorage} 
            />
            
            {/* Pass the plans array and currentPlan to SubscriptionInfo */}
            <SubscriptionInfo 
                currentPlan={currentPlan} 
                plans={plans} 
                setCurrentPlan={setCurrentPlan} 
            />

            <TorrentManagement 
                files={files} 
                setFiles={setFiles} 
                currentPlan={currentPlan} 
                onDownloadComplete={handleDownloadComplete} 
            />
            <FileManagement files={files} setFiles={setFiles} />

            {/* Sample button to trigger a subscription reminder notification */}
            <button onClick={handleSubscriptionReminder} className="btn btn-warning mt-4">
                Test Subscription Reminder
            </button>
        </div>
    );
}

export default DashboardPage;
