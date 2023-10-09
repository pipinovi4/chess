import axios, { AxiosError } from 'axios';

const $apiAuth = axios.create({
    baseURL: 'https://localhost:5000/authorization',
});

export default $apiAuth;
