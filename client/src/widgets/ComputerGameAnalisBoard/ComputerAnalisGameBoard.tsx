import useAppSelector from '../../global/hooks/useAppSelector';

const ComputerAnalisGameBoard = () => {
    const gameState = useAppSelector(state => state.botGame);

    const movesPairs = [];
    for (let i = 0; i < gameState.moves.length; i += 2) {
        const move1 = gameState.moves[i];
        const move2 = gameState.moves[i + 1];
        movesPairs.push([move1, move2]);
    }

    return (
        <div className='game-bot__analis'>
            {movesPairs.map((pair, index) => (
                <div className='analis-line' key={index}>
                    {pair.map((move, moveIndex) => (
                        <p key={moveIndex}>{move}</p>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ComputerAnalisGameBoard;
