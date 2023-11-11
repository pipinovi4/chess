import { AxiosResponse } from 'axios'
import { $userApi } from '../api/userApi'
import { AuthResponse } from '../types/httpTypes'

/**
 * Service for user authentication and related operations.
 */
class AuthService {
    /**
     * Authenticate a user.
     * @param {string} personalInformation - The user's identification information.
     * @param {string} password - The user's password.
     * @returns {Promise<AuthResponse | null>} - User data or null in case of an error.
     */
    static async login(
        personalInformation: string,
        password: string
    ): Promise<AuthResponse | null> {
        try {
            const response = await $userApi.post('/login', {
                personalInformation,
                password,
            })

            if (!response?.data) {
                throw new Error('No response data')
            }

            localStorage.setItem('accessToken', response.data.accessToken)

            return response.data
        } catch (error) {
            console.error('Error during login:', error)
            throw error
        }
    }

    /**
     * Register a new user.
     * @param {string} email - The user's email.
     * @param {string} userName - The user's name.
     * @param {string} password - The user's password.
     * @returns {Promise<AuthResponse | null>} - Data of the new user or null in case of an error.
     */
    static async registration(
        email: string,
        userName: string,
        password: string
    ): Promise<AuthResponse | null> {
        try {
            const response: AxiosResponse<AuthResponse | null> =
                await $userApi.post('/registration', {
                    email,
                    userName,
                    password,
                })
            if (!response.data) {
                throw new Error('No response data')
            }

            localStorage.setItem('accessToken', response.data.accessToken)

            return response.data
        } catch (error) {
            console.error('Error during registration:', error)
            throw error
        }
    }

    /**
     * Log a user out of the system.
     * @returns {Promise<void>} - A promise of the logout operation.
     */
    static async logout(): Promise<void> {
        return $userApi.post('/logout')
    }

    /**
     * validation of personnel information for impracticability
     * @param {string} personalInformation - The data to search for.
     * @returns {Promise<AuthResponse | null>} - User data or null in case of an error.
     */
    static async validatePersonalInformationData(
        personalInformation: string
    ): Promise<AuthResponse | null> {
        try {
            const emailRegex =
                /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
            let response: AxiosResponse<AuthResponse | null>
            if (personalInformation.match(emailRegex)) {
                response = await $userApi.post('/find-auth-data', {
                    email: personalInformation,
                })
            } else if (personalInformation) {
                response = await $userApi.post('/find-auth-data', {
                    userName: personalInformation,
                })
            } else {
                throw new Error(
                    'Incorrect personal information when you try to make a request'
                )
            }
            return response.data
        } catch (error) {
            console.error('Error during data search:', error)
            throw error
        }
    }
}

export default AuthService
