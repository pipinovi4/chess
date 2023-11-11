/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useEffect, useState } from 'react'
import mail from '../../../assets/mail.svg'
import pesron from '../../../assets/person.svg'
import lock from '../../../assets/lock.svg'
import eye from '../../../assets/eye.svg'
import eyeCrossed from '../../../assets/eye-crossed.svg'
import checkmark from '../../../assets/checkmark.svg'
import './registrationForm.scss'
import AuthService from '../../../../../https/services/UserServices'

interface RegistrationFormProps {
    registrationStart: boolean
    setRegistrationStart: (registrationStart: boolean) => void
    setActiveRegistration: (activeRegistration: boolean) => void
}

const RegistrationForm: FC<RegistrationFormProps> = ({
    registrationStart,
    setRegistrationStart,
    setActiveRegistration,
}) => {
    const [password, setPassword] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [passwordVisibylity, setPasswordVisibility] = useState<boolean>(false)
    const [isValidEmail, setIsValidEmail] = useState<boolean>()
    const [isValidUserName, setIsValidUserName] = useState<boolean>()
    const [timeoutInputRequest, setTimeoutInputRequest] =
        useState<boolean>(false)

    const handleChangePasswordInput = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }
    const handleChangeUsernameInput = (e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value)
        if (e.target.value.length < 4) {
            setIsValidUserName(false)
        } else {
            handleTimeoutInputValide(e.target.value)
        }
    }
    const handleChangeEmailInput = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (e.target.value.length < 4) {
            setIsValidEmail(false)
        } else {
            handleTimeoutInputValide(e.target.value)
        }
    }

    //timeout of request to the server for data valdation
    const handleTimeoutInputValide = (data: string) => {
        if (!timeoutInputRequest && data.length > 3) {
            setTimeoutInputRequest(true)
            setTimeout(() => {
                validateAuthData(data)
                setTimeoutInputRequest(false)
            }, 1000)
        }
    }

    const validateAuthData = async (data: string) => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (emailRegex.test(data)) {
                const response =
                    await AuthService.validatePersonalInformationData(data)
                if (response) {
                    setIsValidEmail(false)
                } else {
                    setIsValidEmail(true)
                }
            } else {
                console.log('start userName')
                const response =
                    await AuthService.validatePersonalInformationData(data)
                if (response) {
                    setIsValidUserName(false)
                } else {
                    setIsValidUserName(true)
                }
            }
        } catch (error) {
            console.error(
                'An error occurred while executing a database query:',
                error
            )
        }
    }

    useEffect(() => {
        if (registrationStart) {
            if (isValidEmail && isValidUserName) {
                AuthService.registration(email, userName, password)
                setRegistrationStart(false)
                setActiveRegistration(false)
            }
        }
    }, [registrationStart])

    return (
        <div className="container-registration__form">
            <input
                onChange={handleChangeUsernameInput}
                value={userName}
                className="username-input"
                type="text"
                placeholder="Username"
            />
            {isValidUserName && (
                <img
                    className="checkmark-validation__userName"
                    src={checkmark}
                />
            )}
            <img className="username-input__image" src={pesron} alt="person" />
            <input
                onChange={handleChangeEmailInput}
                value={email}
                className="email-input"
                type="text"
                placeholder="Email"
            />
            {isValidEmail && (
                <img className="checkmark-validation__email" src={checkmark} />
            )}
            <img className="email-input__image" src={mail} alt="" />
            <input
                onChange={handleChangePasswordInput}
                value={password}
                className="password-input"
                type={passwordVisibylity ? 'text' : 'password'}
                placeholder="Password"
            />
            <img className="password-input__image" src={lock} alt="" />
            <img
                onClick={() => setPasswordVisibility(!passwordVisibylity)}
                className="input-password__switch"
                src={passwordVisibylity ? eye : eyeCrossed}
                alt="eye"
            />
        </div>
    )
}

export default RegistrationForm
