import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import GoogleCaptcha from './GoogleCaptcha';
import Swal from 'sweetalert2';
import styles from './Login.module.css';

function Login() {
    const navigate = useNavigate();
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
            // Perform a GET request to find user with matching email and password
            const response = await api.get('/users', {
                params: {
                    email: email,
                    password: password
                }
            });
    
            if (response.data.length > 0) {
                Swal.fire('Success', 'Login successful!', 'success');
                navigate('/dashboard');
            } else {
                Swal.fire('Error', 'Login failed. Please check your credentials.', 'error');
            }
        } catch (err) {
            console.error("Error details:", err);
            Swal.fire('Error', 'Login failed. Please check your credentials.', 'error');
        }
    };
    

    return (
        <div className={`container ${styles.container}`}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary w-100 mt-3">Login</button>
            </form>
            <div className="text-center mt-3">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="text-center mt-2">
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>
    );
}

export default Login;
