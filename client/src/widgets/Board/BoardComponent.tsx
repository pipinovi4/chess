/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useRef, useState } from 'react'
import CellComponent from './components/Cell/CellComponent'
import './style.scss'
import gameBoardPNG from '../../assets/game-board-fs8.png'
import Board from '../../entites/board/Board'
import { Cell } from '../../entites/cell/Cell'
import moveFigureService from '../../services/moveServices/moveFigureService'
import EngineModel from '../../entites/EngineModel'
import OnlineGameModel from '../../entites/OnlineGameModel'
import { FigureNames } from '../../entites/figures/Figure'
import PawnPromotionDialog from './components/PawnPromotionDialog/PawnPromotionDialog'

interface BoardComponentProps {
    gameMode: EngineModel | OnlineGameModel
    setBoard: React.Dispatch<React.SetStateAction<Board>>
    board: Board
    nowCanMakeMove: boolean
}

const BoardComponent: FC<BoardComponentProps> = ({
    gameMode,
    board,
    setBoard,
    nowCanMakeMove,
}) => {
    const [cellPawnPromotion, setCellPawnPromotion] = useState<Cell | null>(
        null
    )
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const boardRef = useRef<HTMLDivElement | null>(null)

    const moveFigure = async (cell: Cell) => {
        if (nowCanMakeMove) {
            if (gameMode instanceof OnlineGameModel && selectedCell) {
                gameMode.prepareAndSendMoveOpponent(selectedCell, cell)
            } else if (gameMode instanceof EngineModel && selectedCell) {
                gameMode.prepareAndSendMoveEngine(selectedCell, cell)
            } else if (!(gameMode instanceof OnlineGameModel || EngineModel)) {
                throw new Error('Game mode is incorrect in BoardComponents')
            }
            if (
                selectedCell &&
                selectedCell?.figure?.name === FigureNames.PAWN &&
                (cell.y === 0 || cell.y === 7) &&
                cell !== selectedCell
            ) {
                setCellPawnPromotion(cell)
                return
            }
            moveFigureService.handleMoveFigure(
                cell,
                selectedCell,
                setSelectedCell
            )
            setCellPawnPromotion(null)
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setCellPawnPromotion(null)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

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
                if (
                    selectedCell?.figure?.name === FigureNames.PAWN &&
                    (targetCell.y === 0 || targetCell.y === 7) &&
                    selectedCell.figure.canMove(targetCell)
                ) {
                    setCellPawnPromotion(targetCell)
                    moveFigureService.handleMouseUp()
                } else if (selectedCell?.figure?.canMove(targetCell)) {
                    moveFigure(targetCell)
                } else {
                    moveFigureService.handleMouseUp()
                }
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
        <div className="container-board">
            <div ref={boardRef} className="board">
                {cellPawnPromotion &&
                    selectedCell &&
                    selectedCell.figure?.canMove(cellPawnPromotion) &&
                    selectedCell !== cellPawnPromotion && (
                        <PawnPromotionDialog
                            selectedCell={selectedCell}
                            cellPawnPromotion={cellPawnPromotion}
                            setCellPawnPromotion={setCellPawnPromotion}
                        />
                    )}
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
                                        cellPawnPromotion={cellPawnPromotion}
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
    )
}

export default BoardComponent
