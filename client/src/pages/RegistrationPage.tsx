import axios from 'axios'

const RegistrationPage = () => {
    const apiAuth = axios.create({
        withCredentials: true,
        baseURL: 'https://localhost:5000/authorization'
    })

    const handleRegistration = async () => {
        console.log(1231231);
        const response = await apiAuth.post('/registration', {email: 'nasdasfadfdsrkl@gmail.com', password: 'haebator'});
        console.log(response);
    };
    
    return (
        <div>
            <button onClick={handleRegistration}>registration</button>
        </div>
    );
};

export default RegistrationPage;