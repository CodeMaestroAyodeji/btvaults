import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardPage from './components/pages/DashboardPage';
import ProfileSettings from './components/pages/ProfileSettings';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile-settings" element={<ProfileSettings />} />
            </Routes>
        </Router>
    );
}

export default App;
