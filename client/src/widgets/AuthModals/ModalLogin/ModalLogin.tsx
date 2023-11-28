/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react'
import './style.scss'
import logoPawn from '../../../assets/logo.svg'
import SocailLogin from './components/SocialLogin/SocailLogin'
import LoginForm from './components/LoginForm/LoginForm'

interface ModalLoginProps {
    setActiveLogin: (activeLogin: boolean) => void
    setActiveRegistration: (activeRegistration: boolean) => void
    activeLogin: boolean
}

const ModalLogin: FC<ModalLoginProps> = ({
    setActiveLogin,
    setActiveRegistration,
    activeLogin,
}) => {
    const containerModalRef = useRef<HTMLDivElement | null>(null)
    const [firstClick, setFirstClick] = useState<boolean>(true)
    const [loginStart, setLoginStart] = useState<boolean>(false)

    const handleClickOutside = (e: MouseEvent) => {
        if (
            containerModalRef.current &&
            !containerModalRef.current.contains(e.target as Node)
        ) {
            setActiveLogin(false)
            document.removeEventListener('click', handleClickOutside)
        }
    }

    useEffect(() => {
        switch (firstClick) {
            case true:
                setFirstClick(false)
                break
            case false:
                if (activeLogin) {
                    document.addEventListener('click', handleClickOutside)
                    return () => {
                        document.removeEventListener(
                            'click',
                            handleClickOutside
                        )
                    }
                }
        }
    }, [activeLogin, firstClick])

    return (
        <div className="overlay-login">
            <button
                className="close-button__login"
            >
                &times;
            </button>
            <div className="container-modal__login" ref={containerModalRef}>
                <div className="login-modal__header">
                    <img className="login-logo__image" src={logoPawn} alt="" />
                    <h1 className="login-logo__title">
                        Chess<span>-up</span>
                    </h1>
                </div>
                <LoginForm
                    loginStart={loginStart}
                    setLoginStart={setLoginStart}
                    setActiveLogin={setActiveLogin}
                />
                <div className="submit-logIn__container">
                    <button
                        onClick={() => setLoginStart(true)}
                        className="submit-logIn"
                    >
                        Log in
                    </button>
                </div>
                <div className="footers">
                    <div className="line" />
                    <p className="text-footers">OR</p>
                    <div className="line" />
                </div>
                <SocailLogin />
                <div className="footer">
                    <p className="footer-text">
                        New?
                        <span
                            onClick={() => {
                                setActiveLogin(false)
                                setActiveRegistration(true)
                            }}
                            className="activate-modal__registration"
                        >
                            Sign up - and start playing chess
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ModalLogin
