import axios, { AxiosError } from 'axios';

const $apiAuth = axios.create({
    baseURL: 'https://localhost:5000/authorization',
    withCredentials: true
});

export default $apiAuth;
