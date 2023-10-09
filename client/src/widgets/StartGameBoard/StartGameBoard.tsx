import './startGameBoard.scss';
import arrow from '../../assets/arrow.svg';
import clock from '../../assets/clock.svg';
import handShake from '../../assets/handshake-fs8.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardOptionGames from './components/CardsOptionGames/CardsOptionGames';
import lightning from '../../assets/lightning.svg';
import bullet from '../../assets/bullet.svg';
import { io, Socket as ServerSocket } from 'socket.io-client';

const StartGameBoard = () => {
    const [activeArrow, setActiveArrow] = useState<boolean>(false);
    const [activeOptionsGame, setActiveOptionsGame] = useState<boolean>(false);
    const [modeGame, setModeGame] = useState<string>('');
    const [gameSocket, setGameSocket] = useState<ServerSocket | null>(null)

    const navigate = useNavigate();

    const handleSwitchOptionsGame = () => {
        setActiveArrow(!activeArrow);
        setActiveOptionsGame(!activeOptionsGame);
    };

    const getGameMode = () => {
        if (modeGame.includes('1 min') || modeGame.includes('2 | 1') || modeGame.includes('1 | 1')) {
            return 'bullet';
        } else if (modeGame.includes('3 min') || modeGame.includes('3 | 2') || modeGame.includes('5 min')) {
            return 'blitz';
        } else if (modeGame.includes('10 min') || modeGame.includes('15 | 10') || modeGame.includes('30 min')) {
            return 'rapid';
        }
    };

    const getGameModeImage = () => {
        const gameMode = getGameMode(); 
        if (gameMode === 'bullet') {
            return bullet; 
        } else if (gameMode === 'blitz') {
            return lightning; 
        } else if (gameMode === 'rapid') {
            return clock;
        } else {
            return clock;
        }
    };

    const handleStartGame = () => {
        const gameSocket: ServerSocket = io('https://localhost:5000')
        setGameSocket(gameSocket)
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
                        />
                        <h3 className="text-game__options">{modeGame ? modeGame : '10 min'}</h3>
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
                        setModeGame={setModeGame}
                        modeGame={modeGame}
                    />
                )}
                <div className="button-start__game">Play</div>
                <div onClick={() => navigate('/play/friend')} className="contaier-card__friend">
                    <img className='image-card__friend' src={handShake} alt="" />
                    <h3 className='text-card__friend'>Play a Friend</h3>
                </div>
            </div>
        </div>
    );
};

export default StartGameBoard;
