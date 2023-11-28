import './style.scss'
import arrow from '../../assets/arrow.svg'
import clock from '../../assets/clock.svg'
import { FC, useEffect, useState } from 'react'
import CardOptionGames from '../CardsOptionGames/CardsOptionGames'
import lightning from '../../assets/lightning.svg'
import bullet from '../../assets/bullet.png'
import OnlineGameModel from '../../entites/OnlineGameModel'

interface StartGameBoardProps {
    onlineGameModel: OnlineGameModel
}

const StartGameBoard: FC<StartGameBoardProps> = ({ onlineGameModel }) => {
    const [activeArrow, setActiveArrow] = useState<boolean>(false)
    const [activeOptionsGame, setActiveOptionsGame] = useState<boolean>(false)
    const [gameDurationMode, setGameDurationMode] = useState<string>('10 min')

    useEffect(() => {
        onlineGameModel.setGameDurationMode(gameDurationMode)
    }, [gameDurationMode, onlineGameModel])

    const handleSwitchOptionsGame = () => {
        setActiveArrow(!activeArrow)
        setActiveOptionsGame(!activeOptionsGame)
    }

    const getGameMode = () => {
        const durationMatch = gameDurationMode.match(/\d+/)
        if (durationMatch) {
            const durationValue = parseInt(durationMatch[0])
            if (durationValue >= 1 && durationValue < 2) {
                return 'bullet'
            } else if (durationValue >= 3 && durationValue < 10) {
                return 'blitz'
            } else if (durationValue >= 10) {
                return 'rapid'
            }
        }
        return 'unknown'
    }

    const getGameModeImage = () => {
        const gameMode = getGameMode()
        switch (gameMode) {
            case 'bullet':
                return bullet
            case 'blitz':
                return lightning
            case 'rapid':
                return clock
            default:
                return clock
        }
    }

    const handleStartOnlineGame = async () => {
        try {
            await onlineGameModel.prepareAndStartOnlineGame()
        } catch (error) {
            throw new Error('Error when trying handle start online game')
        }
    }

    return (
        <div className="container-board__startGame">
            <div className="container-board">
                <div
                    onClick={handleSwitchOptionsGame}
                    className="container-game__options"
                >
                    <div className="main-game__options">
                        <img
                            className="clock-game__options"
                            src={getGameModeImage()}
                            alt=""
                            style={
                                getGameMode() === 'bullet'
                                    ? { transform: 'rotate(-60deg)', height: '25%', marginTop: '4px' }
                                    : {}
                            }
                        />
                        <h3 className="text-game__options">
                            {gameDurationMode ? gameDurationMode : '10 min'}
                        </h3>
                        <img
                            className={[
                                'arrow-game__options',
                                activeArrow && 'active-arrow',
                            ].join(' ')}
                            src={arrow}
                            alt="arrow"
                        />
                    </div>
                </div>
                {activeOptionsGame && (
                    <CardOptionGames
                        handleSwitchOptionsGame={handleSwitchOptionsGame}
                        setModeGame={setGameDurationMode}
                        modeGame={gameDurationMode}
                    />
                )}
                <button
                    onClick={handleStartOnlineGame}
                    className="button-start__game"
                >
                    Play
                </button>
            </div>
        </div>
    )
}

export default StartGameBoard
