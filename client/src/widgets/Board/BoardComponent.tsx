/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react'
import CellComponent from '../Cell/CellComponent'
import './style.scss'
import gameBoardPNG from '../../assets/game-board-fs8.png'
import Board from '../../entites/board/Board'
import { Cell } from '../../entites/cell/Cell'
import moveFigureService from '../../services/moveServices/moveFigureService'
import EngineModel from '../../entites/EngineModel'
import OnlineGameModel from '../../entites/OnlineGameModel'

interface BoardComponentProps {
    gameMode: EngineModel | OnlineGameModel
    setBoard: React.Dispatch<React.SetStateAction<Board>>
    board: Board
}

const BoardComponent: FC<BoardComponentProps> = ({ gameMode, board, setBoard }) => {
    const [activeModal, setActiveModal] = useState(false)
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const boardRef = useRef<HTMLDivElement | null>(null)

    const moveFigure = async (cell: Cell) => {
        if (gameMode instanceof OnlineGameModel && selectedCell) {
            gameMode.prepareAndSendMoveOpponent(selectedCell, cell)
        } else if (gameMode instanceof EngineModel && selectedCell) {
            gameMode.prepareAndSendMoveEngine(selectedCell, cell)
        } else if (!(gameMode instanceof OnlineGameModel || EngineModel)) {
            throw new Error('Game mode is incorrect in BoardComponents')
        }
        moveFigureService.handleMoveFigure(
            cell,
            selectedCell,
            setSelectedCell
        )
    }

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            moveFigureService.handleMouseMove(event)
        }

        const handleMouseUp = (event: MouseEvent) => {
            const targetCords = moveFigureService.detectedTargetCell(
                selectedCell,
                event
            )
            if (targetCords) {
                const targetCell = board.getCell(targetCords.x, targetCords.y)
                if (selectedCell?.figure?.canMove(targetCell)) {
                    moveFigure(targetCell)
                }
                moveFigureService.handleMouseUp()
            }
        }

        if (moveFigureService.isMouseDown) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [selectedCell])

    useEffect(() => {
        board.highlightCells(selectedCell)
        setBoard((prevBoard) => prevBoard.getCopyBoard())
    }, [selectedCell])

    return (
        <>
            <div className="container-board">
                <div ref={boardRef} className="board">
                    {board.cells.map((row, index) => {
                        return (
                            <React.Fragment key={index}>
                                {row.map((cell) => {
                                    return (
                                        <CellComponent
                                            moveFigure={moveFigure}
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
                    <img className="image-board" src={gameBoardPNG} alt="" />
                </div>
            </div>
        </>
    )
}

export default BoardComponent
