import React, { FC, useEffect, useState } from 'react'
import { Board } from '../entites/board/Board'
import CellComponent from './CellComponent'
import '../styles/board.scss'
import { Cell } from '../entites/cell/Cell'
import { FigureNames } from '../entites/figures/Figure'
import { Colors } from '../constants/Colors'

interface BoardProps {
    board: Board
    setBoard: (board: Board) => void
}

const BoardComponent: FC<BoardProps> = ({ board, setBoard }) => {
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null)
    const [activeModal, setActiveModal] = useState(false)

    const click = (cell: Cell) => {
        if (
            selectedCell &&
            selectedCell !== cell &&
            selectedCell.figure?.canMove(cell)
        ) {
            if (selectedCell.figure.name === FigureNames.PAWN) {
                const promotionCell =
                    selectedCell.figure?.color === Colors.WHITE ? 0 : 7

                if (cell.y === promotionCell) {
                    setActiveModal(true)
                }
            }
            selectedCell.moveFigure(cell)
            setSelectedCell(null)
        } else {
            setSelectedCell(cell)
        }
    }

    useEffect(() => {
        highlightCells()
    }, [selectedCell])

    const highlightCells = () => {
        board.highlightCells(selectedCell)
        updateBoard()
    }

    const updateBoard = () => {
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    return (
        <div className="board">
            {board.cells.map((row, index) => {
                return (
                    <React.Fragment key={index}>
                        {row.map((cell) => {
                            return (
                                <CellComponent
                                    key={cell.id}
                                    cell={cell}
                                    click={click}
                                    selected={
                                        cell.x === selectedCell?.x &&
                                        cell.y === selectedCell?.y
                                    }
                                    activeModal={activeModal}
                                    setActiveModal={setActiveModal}
                                />
                            )
                        })}
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default BoardComponent
