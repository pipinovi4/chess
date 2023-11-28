/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, FC, useEffect, useState } from 'react'
import pesron from '../../../assets/person.svg'
import lock from '../../../assets/lock.svg'
import greyCheckMark from '../../../assets/grey-checkmark.svg'
import greenCheckMark from '../../../assets/checkmark.svg'
import eye from '../../../assets/eye.svg'
import croossedEye from '../../../assets/eye-crossed.svg'
import './style.scss'
import AuthService from '../../../../../https/services/UserServices'

interface LoginFormProps {
    loginStart: boolean
    setLoginStart: (loginStart: boolean) => void
    setActiveLogin: (activeLogin: boolean) => void
}

const LoginForm: FC<LoginFormProps> = ({
    loginStart,
    setActiveLogin,
    setLoginStart,
}) => {
    const [personalInformation, setPersonalInformation] = useState<string>('')
    const [activeCheckbox, setActiveCheckbox] = useState<boolean>(false)
    const [isValidPersonalInformation, setIsValidPersonalInformation] =
        useState<boolean>(false)
    const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false)
    const [timeoutInputRequest, setTimeoutInputRequest] =
        useState<boolean>(false)
    const [password, setPassword] = useState<string>('')

    const changePersonalInformation = (e: ChangeEvent<HTMLInputElement>) => {
        setPersonalInformation(e.target.value)
        handleTimeoutInputValide(e.target.value)
    }

    const changePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    //timeout of request to the server for data valdation
    const handleTimeoutInputValide = (personalInformation: string) => {
        if (personalInformation.length < 4) {
            setIsValidPersonalInformation(false)
        }

        if (!timeoutInputRequest && personalInformation.length > 3) {
            setTimeoutInputRequest(true)
            setTimeout(() => {
                validatePersonalInformation(personalInformation)
                setTimeoutInputRequest(false)
            }, 1000)
        }
    }

    const validatePersonalInformation = async (personalInformation: string) => {
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (emailRegex.test(personalInformation)) {
                const responseDb =
                    await AuthService.validatePersonalInformationData(
                        personalInformation
                    )
                if (responseDb) {
                    setIsValidPersonalInformation(false)
                } else {
                    setIsValidPersonalInformation(true)
                }
            }
        } catch (error) {
            console.error(
                'An error occurred while executing a database query:',
                error
            )
            setIsValidPersonalInformation(false)
        }
    }

    useEffect(() => {
        if (loginStart) {
            if (isValidPersonalInformation) {
                AuthService.login(personalInformation, password)
                setLoginStart(false)
                setActiveLogin(false)
            }
        }
    }, [loginStart])

    return (
        <div className="login-modal__form">
            <div className="personal-information__form">
                <input
                    onChange={changePersonalInformation}
                    className="personal-information__input"
                    type="text"
                    placeholder="Username or Email"
                />
                <img className="person-in__input" src={pesron} alt="person" />
                {isValidPersonalInformation && (
                    <img
                        className="checkmark-personal__information"
                        src={greenCheckMark}
                        alt="checkmark"
                    />
                )}
            </div>
            <div className="password-form">
                <input
                    onChange={changePassword}
                    className="password-input"
                    type={isVisiblePassword ? 'text' : 'password'}
                    placeholder="Password"
                />
                <img className="lock-in__input" src={lock} alt="lock" />
                <img
                    onClick={() => setIsVisiblePassword(!isVisiblePassword)}
                    className="eye-password__visible"
                    src={isVisiblePassword ? eye : croossedEye}
                />
            </div>
            <div className="authentication-controls">
                <input
                    className="checkbox-remember__account"
                    type="checkbox"
                    name="Remember me"
                    id="checkbox-login"
                />
                <label
                    onClick={() => {
                        console.log('checked')
                        setActiveCheckbox(!activeCheckbox)
                    }}
                    htmlFor="checkbox-login"
                    className="checkbox-label"
                >
                    <div
                        className={[
                            'custom-checkbox-label',
                            activeCheckbox ? 'active' : '',
                        ].join(' ')}
                    >
                        {activeCheckbox && (
                            <img
                                className="checkbox-checkmark__label"
                                src={greyCheckMark}
                                alt="checkmark"
                            />
                        )}
                    </div>
                    <span className="label-checkbox__text">Remember me</span>
                </label>
                <p className="text-question__password">Forgot password?</p>
            </div>
        </div>
    )
}

export default LoginForm
