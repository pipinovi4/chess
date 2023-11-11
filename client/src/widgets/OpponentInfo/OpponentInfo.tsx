import { FC, useEffect, useState } from 'react'
import './style.scss'
import { fetchUserById } from '../../https/api/databaseApi'
import * as uuid from 'uuid'
import botAvatar from '../../assets/bot-avatar.png'
import EngineModel from '../../entites/EngineModel'
import Board from '../../entites/board/Board'
import { Player } from '../../entites/player/Player'
import { Colors } from '../../constants/Colors'

interface OpponentInfoProps {
    player: Player | undefined
    engineModel?: EngineModel
    gameBoard: Board | null
}

const OpponentInfo: FC<OpponentInfoProps> = ({
    player,
    engineModel,
    gameBoard,
}) => {
    const [avatartUrl, setAvatarUrl] = useState<string>('')
    const [userName, setUserName] = useState<string>('')
    const [botDifficulty, setBotDifficulty] = useState<string>('')

    useEffect(() => {
        const fetchUserData = async () => {
            let user
            switch (typeof player?.id) {
                case 'string':
                    user = await fetchUserById(player.id)
                    break
                case 'undefined':
                    user = await fetchUserById()
                    break
                default:
                    console.log('opponentId in localstorage is undefined')
            }
            if (user) {
                setAvatarUrl(user.avatar)
                setUserName(user.userName)
            } else {
                throw new Error(
                    "When trying to get the player's data they turned out to be undefined"
                )
            }
        }

        if (engineModel && engineModel.difficaltyBot) {
            setBotDifficulty(engineModel.difficaltyBot)
            console.log(engineModel.difficaltyBot)
        } else {
            setBotDifficulty('proffesional') // Установите значение по умолчанию
        }

        fetchUserData()
    }, [engineModel, engineModel?.difficaltyBot, player?.id])

    return (
        <div
            className={[
                player?.id || engineModel
                    ? 'container-opponent__info'
                    : 'container-currentUser__info',
            ].join(' ')}
        >
            {engineModel && !player?.id ? (
                <>
                    <img
                        className="user-info__avatar"
                        src={botAvatar}
                        alt="user avatar"
                    />
                    <p className="user-info__name">
                        {botDifficulty.charAt(0).toUpperCase() +
                            botDifficulty.slice(1)}
                    </p>
                </>
            ) : (
                <>
                    <img
                        className="user-info__avatar"
                        src={`data:image/jpeg;base64,${avatartUrl}`}
                        alt="user avatar"
                    />
                    <p className="user-info__name">{userName}</p>
                </>
            )}

            <div className="winning-figures">
                {player?.color === Colors.WHITE
                    ? gameBoard?.lostFiguresBlack.map((whiteCapturedPieces) => (
                          <div className="captured-pieces" key={uuid.v4()}>
                              {whiteCapturedPieces.logo && (
                                  <img
                                      className="capuret-piace__image"
                                      src={whiteCapturedPieces.logo}
                                      alt="chess-figure"
                                  />
                              )}
                          </div>
                      ))
                    : gameBoard?.lostFiguresWhite.map((whiteCapturedPieces) => (
                          <div className="captured-pieces" key={uuid.v4()}>
                              {whiteCapturedPieces.logo && (
                                  <img
                                      className="capuret-piace__image"
                                      src={whiteCapturedPieces.logo}
                                      alt="chess-figure"
                                  />
                              )}
                          </div>
                      ))}
            </div>
        </div>
    )
}

export default OpponentInfo
