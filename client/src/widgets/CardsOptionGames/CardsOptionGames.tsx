import './style.scss'
import lightning from '../../assets/lightning.svg'
import clock from '../../assets/clock.svg'
import bullet from '../../assets/bullet.png'
import { FC } from 'react'

interface CardOptionGameProps {
    setModeGame: (modeGame: string) => void
    modeGame: string
    handleSwitchOptionsGame: () => void
}

const CardOptionGames: FC<CardOptionGameProps> = ({
    setModeGame,
    modeGame,
    handleSwitchOptionsGame,
}) => {
    const handlePickMode = (mode: string) => {
        setModeGame(mode)
        handleSwitchOptionsGame()
    }

    return (
        <div className="card-option__games">
            <div className="container-bullet__cards">
                <div className="title-option">
                    <img className="bullet-option__card" src={bullet} alt="" />
                    <p className="name-option__card">Bullet</p>
                </div>
                <div
                    onClick={() => handlePickMode('1 min')}
                    className={`time-card__1 time-card ${
                        modeGame === '1 min' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">1 min</p>
                </div>
                <div
                    onClick={() => handlePickMode('1 | 1')}
                    className={`time-card__1-1 time-card ${
                        modeGame === '1 | 1' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">1 | 1</p>
                </div>
                <div
                    onClick={() => handlePickMode('2 | 1')}
                    className={`time-card__2-1 time-card ${
                        modeGame === '2 | 1' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">2 | 1</p>
                </div>
            </div>
            <div className="container-blitz__cards">
                <div className="title-option">
                    <img
                        className="ligtning-option__card"
                        src={lightning}
                        alt=""
                    />
                    <p className="name-option__card">Blitz</p>
                </div>
                <div
                    onClick={() => handlePickMode('3 min')}
                    className={`time-card__3 time-card ${
                        modeGame === '3 min' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">3 min</p>
                </div>
                <div
                    onClick={() => handlePickMode('3 | 2')}
                    className={`time-card__3-2 time-card ${
                        modeGame === '3 | 2' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">3 | 2</p>
                </div>
                <div
                    onClick={() => handlePickMode('5 min')}
                    className={`time-card__5 time-card ${
                        modeGame === '5 min' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">5 min</p>
                </div>
            </div>
            <div className="container-rapid__cards">
                <div className="title-option">
                    <img className="clock-option__card" src={clock} alt="" />
                    <p className="name-option__card">Rapid</p>
                </div>
                <div
                    onClick={() => handlePickMode('10 min')}
                    className={`time-card__10 time-card ${
                        modeGame === '10 min' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">10 min</p>
                </div>
                <div
                    onClick={() => handlePickMode('15 | 10')}
                    className={`time-card__15-10 time-card ${
                        modeGame === '15 | 10' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">15 | 10</p>
                </div>
                <div
                    onClick={() => handlePickMode('30 min')}
                    className={`time-card__30 time-card ${
                        modeGame === '30 min' && 'active-option__card'
                    }`}
                >
                    <p className="title-time__card">30 min</p>
                </div>
            </div>
        </div>
    )
}

export default CardOptionGames
