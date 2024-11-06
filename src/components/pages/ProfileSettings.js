// src/pages/ProfileSettings.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';
import styles from './ProfileSettings.module.css';

function ProfileSettings() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        username: 'testuser',
        email: 'test@example.com',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        try {
            await api.put('/users/1', { username: userInfo.username, email: userInfo.email });
            Swal.fire('Success', 'Profile updated successfully!', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update profile. Please try again.', 'error');
        }
    };

    const handleChangePassword = () => {
        if (userInfo.password !== userInfo.confirmPassword) {
            Swal.fire('Warning', "Passwords do not match", 'warning');
            return;
        }
        Swal.fire('Success', 'Password changed successfully!', 'success');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className={`container ${styles.profileSettings}`}>
            <div className="d-flex justify-content-between align-items-center">
                <h2>Profile Settings</h2>
                <div>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary me-2">
                        Back to Dashboard
                    </button>
                    <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                </div>
            </div>
            
            <div className="form-group mt-4">
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={userInfo.username}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={userInfo.email}
                    onChange={handleChange}
                />
            </div>
            <button onClick={handleUpdateProfile} className="btn btn-primary mt-3">Update Profile</button>

            <h3 className="mt-5">Change Password</h3>
            <div className="form-group">
                <label>New Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={userInfo.password}
                    onChange={handleChange}
                />
            </div>
            <div className="form-group">
                <label>Confirm New Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={userInfo.confirmPassword}
                    onChange={handleChange}
                />
            </div>
            <button onClick={handleChangePassword} className="btn btn-secondary mt-3">Change Password</button>
        </div>
    );
}


export default ProfileSettings;
