import { AxiosResponse } from 'axios';
import $api from '../https';
import UserRequest from '../../../../../requstTypes/UserRequest';

const registration = async (email: string, userName: string, password: string) => {
    try {
        const response: AxiosResponse<UserRequest | null> = await $api.post('/registration', { email, userName, password });
        if (!response.data) {
            console.error('Unforseen error')
        }
        return
    } catch (error) {
        console.error('Unforeseen error:', error);
        return null; 
    }
}

export default registration