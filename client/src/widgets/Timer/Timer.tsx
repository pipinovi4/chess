import { FC, useEffect, useRef, useState } from 'react';
import { Colors } from '../../constants/Colors';
import './style.scss';
import OnlineGameModel from '../../entites/OnlineGameModel';

interface TimerProps {
    // currentPlayer: Player | undefined;
    onlineGameModel: OnlineGameModel;
}

const Timer: FC<TimerProps> = ({ onlineGameModel }) => {
    const [currentTime, setCurrentTime] = useState(onlineGameModel._gameDuration);
    const [currentMoveColor, setCurrentMoveColor] = useState<Colors>(Colors.WHITE)
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        setCurrentTime(onlineGameModel._gameDuration);
    }, [onlineGameModel._gameDuration]);

    useEffect(() => {
        const startTimer = () => {
            if (timer.current) {
                clearInterval(timer.current);
            }
    
            timer.current = setInterval(() => {
                // if (currentMoveColor === currentPlayer?.color)
                setCurrentTime(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        };
        
        startTimer();
    }, [currentMoveColor]);

    // const colorTimer = currentPlayer?.color === Colors.WHITE ? 'white-timer' : 'black-timer';

    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    
    const formatTime = (min: number, sec: number): string => {
        return min > 0 ? `${min}:${sec < 10 ? `0${sec}` : sec}` : `${sec > 10 ? `0:${sec}` : sec}`;
    };

    return (
        <div className={['container-timer'].join(' ')}>
            <p className="timer-time">{formatTime(minutes, seconds)}</p>
        </div>
    );
};

export default Timer;
