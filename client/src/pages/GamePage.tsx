import { useEffect, useState } from 'react'
import { Board } from '../entites/board/Board'
import BoardComponent from '../widgets/BoardComponent'

const GamePage = () => {
    const [board, setBoard] = useState<Board>(new Board())

    useEffect(() => {
        restart()
    }, [])

    const restart = () => {
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        setBoard(newBoard)
    }
    return (
        <div className="app">
            <BoardComponent board={board} setBoard={setBoard} />
        </div>
    )
}

export default GamePage
