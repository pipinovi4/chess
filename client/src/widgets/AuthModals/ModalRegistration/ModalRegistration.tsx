/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react'
import './style.scss'
import SkillLevelSelection from './components/SkillLevelSelection/SkillLevelSelection'
import SocialRegistration from './components/SocialRegistration/SocialRegistration'
import RegistrationForm from './components/RegistrationForm/RegistrationForm'

interface ModalRegistrationProps {
    setActiveRegistration: (activeRegistration: boolean) => void
    setActiveLogin: (activeLogin: boolean) => void
    activeRegistration: boolean
}

const ModalRegistration: FC<ModalRegistrationProps> = ({
    setActiveRegistration,
    setActiveLogin,
    activeRegistration,
}) => {
    const [firstClick, setFirstClick] = useState<boolean>(true)
    const [registrationStart, setRegistrationStart] = useState<boolean>(false)
    const containerModalRef = useRef<HTMLDivElement | null>(null)

    const activateLoginModal = () => {
        setActiveRegistration(false)
        setActiveLogin(true)
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (
            containerModalRef.current &&
            !containerModalRef.current.contains(e.target as Node)
        ) {
            setActiveRegistration(false)
            document.removeEventListener('click', handleClickOutside)
        }
    }

    useEffect(() => {
        switch (firstClick) {
            case true:
                setFirstClick(false)
                break
            case false:
                if (activeRegistration) {
                    document.addEventListener('click', handleClickOutside)
                    return () => {
                        document.removeEventListener(
                            'click',
                            handleClickOutside
                        )
                    }
                }
        }
    }, [activeRegistration, firstClick])

    return (
        <div className="overlay-registration">
            <button className="close-button__registration" onClick={() => setActiveRegistration(false)}>
                &times;
            </button>
            <div
                className="container-modal__registration"
                ref={containerModalRef}
            >
                <div className="container-title">
                    <h2 className="title-registration__modal">Join Now</h2>
                    <h3 className="text-registration__modal">
                        and Start Playing Chess!
                    </h3>
                </div>
                <RegistrationForm
                    registrationStart={registrationStart}
                    setRegistrationStart={setRegistrationStart}
                    setActiveRegistration={setActiveRegistration}
                />
                <SkillLevelSelection />
                <div className="container-submit">
                    <button
                        onClick={() => setRegistrationStart(true)}
                        className="signUp-button"
                    >
                        Sign Up
                    </button>
                </div>
                <div className="footers">
                    <div className="line" />
                    <p className="text-footers">OR</p>
                    <div className="line" />
                </div>
                <SocialRegistration />
                <div className="logIn-method__selection">
                    <p className="login-auth__text">
                        Already have an account?
                        <span
                            className="link-login"
                            onClick={activateLoginModal}
                        >
                            Log In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ModalRegistration
