/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react'
import './style.scss'
import { getCurrentUser } from '../../https/api/databaseApi'
import blackPlayerPNG from '../../assets/black-player.png'
import EngineModel from '../../entites/EngineModel'
import { Player } from '../../entites/player/Player'
import OnlineGameModel from '../../entites/OnlineGameModel'
import UserRequest from '../../requstTypes/UserRequest'
import LostFigures from './LostFIgures/LostFigures'
import Board from '../../entites/board/Board'

interface OpponentInfoProps {
    playerStatus: 'current' | 'opponent'
    gameMode: EngineModel | OnlineGameModel
    board: Board
}

const OpponentInfo: FC<OpponentInfoProps> = ({
    gameMode,
    playerStatus,
    board,
}) => {
    const [botDifficulty, setBotDifficulty] = useState<string>('')
    const [player, setPlayer] = useState<Player>()

    useEffect(() => {
        const fetchUserData = async () => {
            if (playerStatus === 'current') {
                const currentUser: UserRequest = await getCurrentUser()
                setPlayer(new Player('current', currentUser))
                if (!currentUser) {
                    throw new Error(
                        "When trying to get the player's data they turned out to be undefined"
                    )
                }
            }
        }

        if (
            gameMode &&
            gameMode instanceof EngineModel &&
            gameMode.difficaltyBot
        ) {
            setBotDifficulty(gameMode.difficaltyBot)
            console.log(gameMode.difficaltyBot)
        } else {
            setBotDifficulty('proffesional')
        }

        fetchUserData()
    }, [])

    return (
        <div
            className={[
                playerStatus === 'current'
                    ? 'container-currentUser__info'
                    : 'container-opponent__info',
            ].join(' ')}
        >
            {!player?.userData && (
                <>
                    <img
                        className="user-info__avatar"
                        src={blackPlayerPNG}
                        alt="user avatar"
                    />
                    <p className="user-info__name">
                        {botDifficulty.charAt(0).toUpperCase() +
                            botDifficulty.slice(1)}
                    </p>
                </>
            )}
            {player && player.userData?.avatar && (
                <>
                    <img
                        className="user-info__avatar"
                        src={player.userData.avatar}
                        alt="user avatar"
                    />
                    <p className="user-info__name">
                        {player?.userData?.userName
                            ? player.userData.userName
                            : 'player'}
                    </p>
                </>
            )}
            <div className="winning-figures">
                <LostFigures player={player} board={board} />
            </div>
        </div>
    )
}

export default OpponentInfo
