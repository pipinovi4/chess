import axios from 'axios'
import { AuthResponse } from '../types/httpTypes'

export const $userApi = axios.create({
    baseURL: 'https://localhost:5000/authorization',
    withCredentials: true,
})

$userApi.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
        'accessToken'
    )}`
    return config
})

$userApi.interceptors.response.use(
    (config) => {
        return config
    },
    async (error) => {
        const originRequest = error.config
        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originRequest._isRetry = true
            try {
                const response = await axios.get<AuthResponse>('refresh')
                localStorage.setItem('accessToken', response.data.accessToken)
                return $userApi.request(originRequest)
            } catch (e) {
                console.log('Аккаунт не авторизован')
            }
        }
    }
)
