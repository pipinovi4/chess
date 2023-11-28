import UtilityBoardUI from '../../shared/UI/UtilityBoard/UtilityBoardUI'
import playwhite from '../../assets/playwhite.svg'
import './style.scss'
import lighning from '../../assets/lightning.svg'
import computer from '../../assets/computer.svg'
import peoples from '../../assets/friends.svg'
import { useNavigate } from 'react-router-dom'

const GameModeSelector = () => {
    const navigate = useNavigate()
    return (
            <UtilityBoardUI>
                <div className="container-game__modes">
                    <div className="container-title">
                        <h2 className="title-text">Play Chess</h2>
                        <img className="title-image" src={playwhite} alt="" />
                    </div>
                    <div className="container-card__modes">
                        <div
                            onClick={() => navigate('/play/online')}
                            className="play-online__card card"
                        >
                            <img
                                className="image-card "
                                src={lighning}
                                alt=""
                            />
                            <h2 className="title-card">Play online</h2>
                            <h3 className="text-card">
                                Play vs a person of similar skill
                            </h3>
                        </div>
                        <div
                            onClick={() => navigate('/play/computer')}
                            className="play-computer__card card"
                        >
                            <img className="image-card" src={computer} alt="" />
                            <h2 className="title-card">Computer</h2>
                            <h3 className="text-card">
                                Challenge a bot from Easy to Master
                            </h3>
                        </div>
                        <div
                            className="play-friend__card card"
                        >
                            <img
                                className="image-card image-card__peoples"
                                src={peoples}
                                alt=""
                            />
                            <h2 className="title-card title-card__people">
                                Profile
                            </h2>
                            <h3 className="text-card text-card__people">
                                Invite a friend to a game of chess
                            </h3>
                        </div>
                    </div>
                </div>
            </UtilityBoardUI>
    )
}

export default GameModeSelector
