import React, { useState } from 'react'
import logoPawn from '../../assets/logo.svg'
import playwhite from '../../assets/playwhite.svg'
import magnifyingGlass from '../../assets/magnifying-glass.svg'
import computer from '../../assets/computer.svg'
import friends from '../../assets/friends.svg'
import sun from '../../assets/sun2.svg'
import earth from '../../assets/earth-globe-tool.svg'
import { useNavigate } from 'react-router-dom'
import ModalRegistration from '../AuthModals/ModalRegistration/ModalRegistration'
import ModalLogin from '../AuthModals/ModalLogin/ModalLogin'

const DefaultLeftBar = () => {
    const [modalActiveLogin, setModalActiveLogin] = useState(false)
    const [modalActiveRegistration, setModalActiveRegistration] =
        useState(false)

    const navigate = useNavigate()

    const handleNavigate = (namePage: string) => {
        navigate(namePage)
    }
    return (
        <div className="main-cotainer">
            {modalActiveRegistration && (
                <ModalRegistration
                    activeRegistration={modalActiveRegistration}
                    setActiveRegistration={setModalActiveRegistration}
                    setActiveLogin={setModalActiveLogin}
                />
            )}
            {modalActiveLogin && (
                <ModalLogin
                    activeLogin={modalActiveLogin}
                    setActiveRegistration={setModalActiveRegistration}
                    setActiveLogin={setModalActiveLogin}
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
                    onClick={() => handleNavigate('/analis')}
                    className="analis-card card"
                >
                    <img
                        className="image-analis image-card"
                        src={magnifyingGlass}
                        alt=""
                    />

                    <h2 className="title">Analis</h2>
                </div>
                <div
                    onClick={() => handleNavigate('/play/computer')}
                    className="computer-card card"
                >
                    <img className="image-card" src={computer} alt="" />
                    <h2 className="title">Bots</h2>
                </div>
                <div
                    onClick={() => handleNavigate('/play/friends')}
                    className="friends-card card"
                >
                    <img
                        className="image-friends image-card"
                        src={friends}
                        alt=""
                    />
                    <h2 className="title">Friend</h2>
                </div>
                <div className="choose-authorization ">
                    <button
                        onClick={() => setModalActiveRegistration(true)}
                        className="sign-up button"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => setModalActiveLogin(true)}
                        className="sign-in button"
                    >
                        Sign In
                    </button>
                </div>
                <div className="utility-card card">
                    <div className="choose-language">
                        <img className="utility-image" src={earth} alt="" />
                        <h3 className="title">English</h3>
                    </div>
                    <div className="choose-color__UI">
                        <img className="utility-image" src={sun} alt="" />
                        <h3 className="title">Light UI</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DefaultLeftBar
