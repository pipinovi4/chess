/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, RefObject, useEffect, useRef } from 'react'
import { Cell } from '../../entites/cell/Cell'
import './style.scss'
import { Colors } from '../../constants/Colors'
import { FigureNames } from '../../entites/figures/Figure'
import ModalPickFigure from '../ModalPickFigure'
import useAppDispatch from '../../global/hooks/useAppDispatch'
import { PayloadAction, createAction } from '@reduxjs/toolkit'
import createChessNotation from '../../hooks/createChessNotation'
import moveFigureService from '../../services/moveFigureService'
import Board from '../../entites/board/Board'
import useAppSelector from '../../global/hooks/useAppSelector'

interface CellProps {
    cell: Cell
    activeModal: boolean
    setActiveModal: (activeModal: boolean) => void
    boardRef: RefObject<HTMLDivElement>
    setSelectedCell: (selectedCell: Cell | null) => void
    selectedCell: Cell | null
    board: Board
}

const CellComponent: FC<CellProps> = ({
    cell,
    activeModal,
    setActiveModal,
    boardRef,
    setSelectedCell,
    selectedCell, 
    board
}) => {
    const figureRef = useRef<HTMLImageElement | null>(null)
    const cellRef = useRef<HTMLDivElement | null>(null)
    const dispatch = useAppDispatch()
    const moveAction = createAction<string>('MOVE')
    const currentMove = useAppSelector(state => state.currentMoveCoordinates)

    useEffect(() => {
        console.log(currentMove)
    }, [currentMove])

    const moveFigure = (cell: Cell) => {
        if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell)) {
            const move = createChessNotation(cell, selectedCell)
            dispatch(moveAction(move))
        }
        moveFigureService.handleMoveFigure(cell, selectedCell, setSelectedCell)
    }

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            moveFigureService.handleMouseMove(cellRef, boardRef, event)
        }

        const handleMouseUp = (event: MouseEvent) => {
            moveFigureService.handleMouseUp()
            if (!moveFigureService.isMouseDown) {
                const cords = moveFigureService.detectedTargetCell(
                    cellRef,
                    cell,
                    event
                )
                if (cords) {
                    moveFigure(
                        cell.board.getCell(cords.x, cords.y),
                    )
                }
            }
            setSelectedCell(null)
        }

        if (
            moveFigureService.isMouseDown &&
            moveFigureService.currentCell === cell
        ) {
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
    }, [moveFigureService.isMouseDown])

    const kingAttacked =
        cell.underAtack.includes(
            cell.figure?.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
        ) &&
        cell.figure &&
        cell.figure?.name === FigureNames.KING
            ? 'king-attacked'
            : ''
    return (
        <div
            onMouseDown={(event: React.MouseEvent) => {
                moveFigure(cell)
                moveFigureService.setCurrentCell(cell)
                moveFigureService.setFigureRef(figureRef)
                moveFigureService.handleMouseDown(event)
                console.log('down')
            }}
            className={[
                'cell',
                cell.color,
                selectedCell === cell && cell.figure ? 'selected' : '',
                kingAttacked,
            ].join(' ')}
            ref={cellRef}
        >
            {cell.available && !cell.figure && <div className="available" />}
            {activeModal &&
                cell.figure?.name === FigureNames.PAWN &&
                cell.y === 0 &&
                cell && (
                    <ModalPickFigure
                        activeModal={activeModal}
                        cell={cell}
                        setActiveModal={setActiveModal}
                    />
                )}
            <div
                className={
                    cell.available && cell.figure ? 'figure-threatened' : ''
                }
            ></div>
            {cell.figure?.logo && (
                <img ref={figureRef} src={cell.figure.logo} alt="" />
            )}
        </div>
    )
}

export default CellComponent
