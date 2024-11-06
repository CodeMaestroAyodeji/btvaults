// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001',  // Point to json-server mock API
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
