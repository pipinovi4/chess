import axios from 'axios'
import UserRequest from '../../requstTypes/UserRequest'

export const databaseApi = axios.create({
    baseURL: 'https://localhost:5000/data',
    withCredentials: true,
})

/**
 * Fetches a user from the database based on the provided userId.
 * If userId is undefined, the function retrieves the user from the cookies.
 *
 * @param {string | undefined} userId User identifier in MongoDB
 * @returns User instance from the database
 */
export const fetchUserById = async (userId?: string): Promise<UserRequest> => {
    try {
        const response = await databaseApi.post('get-user', userId)
        if (!response) {
            throw new Error(
                'When trying to retrieve a user from the database returned undefined response'
            )
        }
        return response.data
    } catch (error) {
        console.error(error)
        throw new Error('An unforeseen error occurred when trying to get user')
    }
}
