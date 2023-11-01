/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react'
import CellComponent from '../Cell/CellComponent'
import './style.scss'
import gameBoard from '../../assets/game-board-fs8.png'
import Board from '../../entites/board/Board'
import { Cell } from '../../entites/cell/Cell'
import moveFigureService from '../../services/moveServices/moveFigureService'
import EngineModel from '../../entites/EngineModel'
import PawnAdvantageColumn from '../PawnAdvantageColumn/PawnAdvantageColumn'

interface BoardComponentProps {
    engineModel: EngineModel
}

const BoardComponent: FC<BoardComponentProps> = ({ engineModel }) => {
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

    const moveFigure = async (cell: Cell) => {
        engineModel.prepareAndSendMoveEngine(selectedCell, cell, setBoard)
        moveFigureService.handleMoveFigure(cell, selectedCell, setSelectedCell)
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
            console.log(targetCords)
            if (targetCords) {
                const targetCell = board.getCell(targetCords.x, targetCords.y)
                if (selectedCell?.figure?.canMove(targetCell)) {
                    moveFigure(board.getCell(targetCords.x, targetCords.y))
                }
            }
            moveFigureService.handleMouseUp()
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
            <PawnAdvantageColumn engineModel={engineModel} />
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
                    <img className="image-board" src={gameBoard} alt="" />
                </div>
            </div>
        </>
    )
}

export default BoardComponent
