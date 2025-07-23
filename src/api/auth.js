import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.88.39:8080/api',
});

export const registerUser = (data) => API.post('/register', data);

export const loginUser = (data) => API.post('/login', data);