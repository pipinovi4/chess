import { AxiosResponse } from 'axios';
import $api from '../https';
import UserRequest from '../../../../../requstTypes/UserRequest';

const findAuthData = async (data: string, nameData: string): Promise<UserRequest | null> => {
    try {
        const response: AxiosResponse<UserRequest | null> = await $api.post('/find-auth-data', { data, nameData });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error('Unforeseen error:', error);
        return null; 
    }
}

export default findAuthData