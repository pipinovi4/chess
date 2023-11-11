import { FC, useEffect, useRef, useState } from 'react';
import { Colors } from '../../constants/Colors';
import './style.scss';
import { Player } from '../../entites/player/Player';
import OnlineGameModel from '../../entites/OnlineGameModel';

interface TimerProps {
    currentPlayer: Player | undefined;
    onlineGameModel: OnlineGameModel;
}

const Timer: FC<TimerProps> = ({ currentPlayer, onlineGameModel }) => {
    const [currentTime, setCurrentTime] = useState(onlineGameModel._gameDuration);
    const timer = useRef<null | ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        setCurrentTime(onlineGameModel._gameDuration);
    }, [onlineGameModel._gameDuration]);

    useEffect(() => {
        startTimer();
    }, [currentPlayer]);

    const startTimer = () => {
        if (timer.current) {
            clearInterval(timer.current);
        }

        timer.current = setInterval(() => {
            setCurrentTime(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
    };

    const colorTimer = currentPlayer?.color === Colors.WHITE ? 'white-timer' : 'black-timer';

    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    
    const formatTime = (min: number, sec: number): string => {
        return min > 0 ? `${min}:${sec < 10 ? `0${sec}` : sec}` : `${sec > 10 ? `0:${sec}` : sec}`;
    };

    return (
        <div className={['container-timer', colorTimer].join(' ')}>
            <p className="timer-time">{formatTime(minutes, seconds)}</p>
        </div>
    );
};

export default Timer;
