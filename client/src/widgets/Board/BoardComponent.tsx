import React, { useEffect, useRef, useState } from 'react'
import CellComponent from '../Cell/CellComponent'
import './style.scss'
import gameBoard from '../../assets/game-board.png'
import Board from '../../entites/board/Board'
import { Cell } from '../../entites/cell/Cell'

const BoardComponent = () => {
    const [activeModal, setActiveModal] = useState(false)
    const [board, setBoard] = useState<Board>(new Board())
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const boardRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        setBoard(newBoard)
    }, [])

    useEffect(() => {
        if (board) {
            board.highlightCells(selectedCell)
            setBoard((prevBoard) => {
                const newBoard = prevBoard.getCopyBoard()
                return newBoard
            })
            console.log(321321)
        }
    }, [selectedCell])

    return (
        <div className="container-board">
            <div ref={boardRef} className="board">
                {board.cells.map((row, index) => {
                    return (
                        <React.Fragment key={index}>
                            {row.map((cell) => {
                                return (
                                    <CellComponent
                                        board={board}
                                        selectedCell={selectedCell}
                                        setSelectedCell={setSelectedCell}
                                        key={cell.id}
                                        cell={cell}
                                        activeModal={activeModal}
                                        setActiveModal={setActiveModal}
                                        boardRef={boardRef}
                                    />
                                )
                            })}
                        </React.Fragment>
                    )
                })}
                <img className="image-board" src={gameBoard} alt="" />
            </div>
        </div>
    )
}

export default BoardComponent
