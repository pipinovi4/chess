/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import { Board } from '../../entites/board/Board'
import CellComponent from '../Cell/CellComponent'
import './style.scss'
import gameBoard from '../../assets/game-board.png'
import moveFigure from '../../models/moveFigure/moveFigure'
import { Cell } from '../../entites/cell/Cell'

const BoardComponent = () => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const [activeModal, setActiveModal] = useState(false)
    const [board, setBoard] = useState<Board | null>(null)
    const boardRef = useRef<HTMLDivElement | null>(null)

    const handleMoveFigure = (cell: Cell) => {
        if (
            selectedCell &&
            selectedCell !== cell &&
            selectedCell.figure?.canMove(cell)
        ) {
            selectedCell.moveFigure(cell)
            setSelectedCell(null)
        } else if (selectedCell === cell) {
            setSelectedCell(null)
        } else {
            setSelectedCell(cell)
        }
    }

    useEffect(() => {
        restart()
    }, [])

    const restart = () => {
        console.log('board')
        const newBoard = new Board()
        newBoard.initCells()
        newBoard.addFigures()
        setBoard(newBoard)
    }

    useEffect(() => {
        highlightCells()
    }, [selectedCell])

    const highlightCells = () => {
        board?.highlightCells(selectedCell)
        updateBoard()
    }

    const updateBoard = () => {
        if (board) {
            const newBoard = board?.getCopyBoard()
            setBoard(newBoard)
        }
    }

    return (
        <div className="container-board">
            <div ref={boardRef} className="board">
                {board?.cells.map((row, index) => {
                    return (
                        <React.Fragment key={index}>
                            {row.map((cell) => {
                                return (
                                    <CellComponent
                                        setSelectedCell={setSelectedCell}
                                        handleMoveFigure={handleMoveFigure}
                                        selectedCell={selectedCell}
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
                <img
                    style={{
                        marginTop: '-87dvh',
                        width: '100%',
                        height: '100%',
                    }}
                    src={gameBoard}
                    alt=""
                />
            </div>
        </div>
    )
}

export default BoardComponent
