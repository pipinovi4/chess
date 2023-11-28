import { FC, useEffect, useState } from 'react'
import logoPawn from '../../../../assets/logo.svg'
import playwhite from '../../../../assets/playwhite.svg'
import computer from '../../../../assets/computer.svg'
import sun from '../../../../assets/sun2.svg'
import earth from '../../../../assets/earth-globe-tool.svg'
import { useNavigate } from 'react-router-dom'
import ModalRegistration from '../../../AuthModals/ModalRegistration/ModalRegistration'
import ModalLogin from '../../../AuthModals/ModalLogin/ModalLogin'
import { getCurrentUser } from '../../../../https/api/databaseApi'
import UserRequest from '../../../../requstTypes/UserRequest'
import './style.scss'
import ProfileModal from '../../../ProfileModal/ProfileModal'

interface LeftbarContentProps {
    isActiveLogin: boolean
    isActiveRegistration: boolean
    setIsActiveLogin: (isActiveLogin: boolean) => void
    setIsActiveRegistration: (isActiveRegistration: boolean) => void
}

const LeftbarContent: FC<LeftbarContentProps> = ({
    isActiveLogin,
    isActiveRegistration,
    setIsActiveLogin,
    setIsActiveRegistration,
}) => {
    const [userAvatar, setUserAvatar] = useState<string>('')
    const [isActiveProfileModal, setIsActiveProfileModal] =
        useState<boolean>(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (localStorage.getItem('accessToken')) {
                const currentUser: UserRequest = await getCurrentUser()
                console.log(userAvatar)
                setUserAvatar(currentUser.avatar)
                if (!currentUser) {
                    throw new Error(
                        "When trying to get the player's data they turned out to be undefined"
                    )
                }
            }
        }

        fetchUserData()
    })
    const navigate = useNavigate()

    const handleNavigate = (namePage: string) => {
        navigate(namePage)
    }
    return (
        <div className="main-cotainer">
            {isActiveProfileModal && (
                <ProfileModal
                    setIsActiveModalProfile={setIsActiveProfileModal}
                />
            )}
            {localStorage.getItem('accessToken') && <></>}
            {isActiveRegistration && (
                <ModalRegistration
                    activeRegistration={isActiveRegistration}
                    setActiveRegistration={setIsActiveRegistration}
                    setActiveLogin={setIsActiveLogin}
                />
            )}
            {isActiveLogin && (
                <ModalLogin
                    activeLogin={isActiveLogin}
                    setActiveRegistration={setIsActiveRegistration}
                    setActiveLogin={setIsActiveLogin}
                />
            )}
            <div className="cards-container">
                <div
                    onClick={() => handleNavigate('/home')}
                    className="logo-card card"
                >
                    <img className="logo" src={logoPawn} alt="" />
                    <h1 className="logo-title">Chess-up</h1>
                </div>
                <div
                    onClick={() => handleNavigate('/play')}
                    className="play-card card"
                >
                    <img
                        className="image-play image-card"
                        src={playwhite}
                        alt=""
                    />
                    <h2 className="title">Play</h2>
                </div>
                <div
                    onClick={() => handleNavigate('/play/computer')}
                    className="computer-card card"
                >
                    <img className="image-card" src={computer} alt="" />
                    <h2 className="title">Bots</h2>
                </div>
                {!localStorage.getItem('accessToken') ? (
                    <div className="choose-authorization ">
                        <button
                            onClick={() => setIsActiveRegistration(true)}
                            className="sign-up__button"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => setIsActiveLogin(true)}
                            className="sign-in__button"
                        >
                            Sign In
                        </button>
                    </div>
                ) : (
                    <div
                        onClick={() => setIsActiveProfileModal(true)}
                        className="friends-card card"
                    >
                        <img
                            className="leftBar-user__avatar"
                            src={userAvatar}
                            alt="user avatar"
                        />
                        <h2 className="title">Profile</h2>
                    </div>
                )}
                <div className="utility-card">
                    <div className="choose-language">
                        <img className="utility-image" src={earth} alt="" />
                        <h3 className="title-choose__language">English</h3>
                    </div>
                    <div className="choose-color__UI">
                        <img className="utility-image" src={sun} alt="sun" />
                        <h3 className="title-choose__colorUI ">Light UI</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftbarContent
