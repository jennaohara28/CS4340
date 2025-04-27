import axios from 'axios';

const api = axios.create({
    baseURL: 'http://76.155.212.102:8080', //
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
