import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import GoogleCaptcha from './GoogleCaptcha';
import Swal from 'sweetalert2';
import styles from './Register.module.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');

    const handleCaptchaVerify = (token) => {
        setCaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            Swal.fire('Warning', "Please verify that you're not a robot", 'warning');
            return;
        }
    
        try {
            const response = await api.post('/users', { 
                username, 
                email, 
                password, 
                captchaToken 
            });
            Swal.fire('Success', 'Registration successful! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            console.error("Error details:", err); // Log full error for inspection
            Swal.fire('Error', 'Registration failed. Please try again.', 'error');
        }
    };
    

    return (
        <div className={`container ${styles.container}`}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mt-3">
                    <GoogleCaptcha onVerify={handleCaptchaVerify} />
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
            </form>
            <div className="text-center mt-3">
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
}

export default Register;
