import React, { useEffect, useState } from 'react'
import { Board } from './models/Board'
import BoardComponent from './components/BoardComponent';

const App = () => {
    const [board, setBoard] = useState<Board>(new Board());

    useEffect(() => {
      restart()
    }, [])

    const restart = () => {
        const newBoard = new Board();
        newBoard.initCells()
        newBoard.addFigures()
        setBoard(newBoard)
    }
    return(
      <div className='app'>
        <BoardComponent board={board} setBoard={setBoard}/>
      </div>
    ) 
}

export default App
