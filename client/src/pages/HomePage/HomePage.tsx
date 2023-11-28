import './style.scss'
import pawnOnBoard from '../../assets/board.png'
import computer from '../../assets/computer.svg'
import { useNavigate } from 'react-router-dom'
import playwhite from '../../assets/playwhite.svg'

const HomePage = () => {
    const navigate = useNavigate()

    const handleNavigate = (namePage: string) => {
        navigate(namePage)
    }
    return (
        <div className="home-content__container">
            <div className="main-container">
                <div className="image-container">
                    <img className="main-image" src={pawnOnBoard} alt="" />
                </div>
                <div className="content-container">
                    <div className="title-content__container">
                        <h1 className="title-content__home">Play Chess</h1>
                        <h1 className="title-content__home">Online</h1>
                        <h1 className="title-content__home">on the #1 Site!</h1>
                    </div>
                    <div className="text-content__container">
                        <div className="container-games__today">
                            <h3 className="text-games__today">
                                <span className="games-today__quantity">
                                    333
                                </span>{' '}
                                Games Today
                            </h3>
                        </div>
                        <div className="container-games__now">
                            <h3 className="text-games__now">
                                <span className="games-now__quantity">12</span>{' '}
                                Playing Now
                            </h3>
                        </div>
                    </div>
                    <div className="game-button__container">
                        <div
                            onClick={() => handleNavigate('/play/online')}
                            className="button-online__game"
                        >
                            <img
                                className="button-online__image"
                                src={playwhite}
                                alt="white pawn in hand"
                            />
                            <div className="text-container__button">
                                <span className='button-title__online'>Play Online</span>
                                <span className="button-text__appeal">
                                    Play with someone at your level
                                </span>
                            </div>
                        </div>
                        <div
                            onClick={() => handleNavigate('/play/computer')}
                            className="button-computer__game"
                        >
                            <img
                                className="button-bot__image"
                                src={computer}
                                alt="computer"
                            />
                            <div className="text-container__button">
                                <span className="button-title__computer">
                                    Play Computer
                                </span>
                                <span className="button-text__appeal">
                                    Play vs customizable training bots
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
