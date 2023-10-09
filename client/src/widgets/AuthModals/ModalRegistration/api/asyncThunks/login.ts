import { AxiosResponse } from 'axios'
import $api from '../https'
import UserRequest from '../../../../../requstTypes/UserRequest'

const login = async (personalInformation: string, password: string) => {
    try {
        console.log(32131)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        let response: AxiosResponse<UserRequest | null> | null = null;

        switch (emailRegex.test(personalInformation)) {
            case true:
                response = await $api.post('/login', { email: personalInformation, password});
                break;
            case false:
                response = await $api.post('/login', { userName: personalInformation, password });
                break;
        }
        if (!response?.data) {
            console.error('Unforseen error')
        } 
        return response?.data;
    } catch (error) {
        console.error('Unforeseen error:', error);
        return null;
    }
}

export default login;

