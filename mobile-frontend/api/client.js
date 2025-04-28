import axios from 'axios';

const api = axios.create({
    // change to 76.155.212.102 for external ip/demo
    baseURL: 'http://10.0.0.195:8080', //
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
