import axios from 'axios';
const api = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    },
});
export const auth = (login, password) => api.post('/auth/sign-in', {username: login, password: password});
export const register = (login, password) => api.post('/auth/sign-up', {username: login, password: password});