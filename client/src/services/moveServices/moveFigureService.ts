/* eslint-disable no-dupe-else-if */
import React, { RefObject } from 'react'
import { Cell } from '../../entites/cell/Cell'
import AnimationMoveFigureService from './AnimationMoveFigureServer'
import Board from '../../entites/board/Board';

type coordinates = { x: number; y: number }

class moveFigureService {
    private startPositionMouse: coordinates
    public isMouseDown: boolean
    private figureRef: RefObject<HTMLImageElement> | null
    private boardRef: RefObject<HTMLDivElement> | null
    private cellRef: RefObject<HTMLDivElement> | null

    constructor() {
        this.startPositionMouse = { x: 0, y: 0 }
        this.isMouseDown = false
        this.cellRef = null
        this.figureRef = null
        this.boardRef = null
    }

    public handleMouseUp = () => {
        if (this.figureRef?.current) {
            this.figureRef.current.style.transform = 'translate(0, 0)'
        }
        this.startPositionMouse = { x: 0, y: 0 }
        this.isMouseDown = false
        this.boardRef = null
        this.figureRef = null
        this.cellRef = null
    }

    public setStartPositionMouse(startPositionMouse: coordinates) {
        this.startPositionMouse = startPositionMouse
    }

    public setIsMouseDown(isMouseDown: boolean) {
        this.isMouseDown = isMouseDown
    }

    public async handleMoveFigure(
        cell: Cell,
        selectedCell: Cell | null,
        setSelectedCell?: (cell: Cell | null) => void,
        setBoard?: React.Dispatch<React.SetStateAction<Board>>
    ) {
        if (
            cell &&
            selectedCell &&
            selectedCell !== cell &&
            selectedCell.figure?.canMove(cell)
        ) {
            const tartgetCellIsFigure = cell.figure !== null
            const selectedFigureRef = document.getElementById(
                selectedCell.figure.id
            )
            const selectedFigureRect =
                selectedFigureRef?.getBoundingClientRect()
            if (selectedFigureRect?.x === 0 && selectedFigureRect?.y === 0) {
                await AnimationMoveFigureService.animateMoveFigure(
                    cell,
                    selectedCell,
                )
            }
            selectedCell.moveFigure(cell)
            if (setSelectedCell) setSelectedCell(null)
            AnimationMoveFigureService.soundMove(
                cell,
                selectedCell,
                tartgetCellIsFigure
            )
            if (setBoard) 
            setBoard((prev) => prev.getCopyBoard())
        } else {
            if (setSelectedCell) setSelectedCell(cell)
        }
    }

    public handleMouseMove = (event: MouseEvent) => {
        if (
            this.figureRef?.current &&
            this.boardRef?.current &&
            this.isMouseDown
        ) {
            const boardRect = this.boardRef.current.getBoundingClientRect()

            const left = event.clientX - boardRect.left
            const top = event.clientY - boardRect.top
            const right = boardRect.right - event.clientX
            const bottom = boardRect.bottom - event.clientY

            const xCorrection = left < -2 ? -left : right < -2 ? right : 0
            const yCorrection = top < -2 ? -top : bottom < -2 ? bottom : 0

            this.figureRef.current.style.transform = `translate(${
                event.clientX - this.startPositionMouse.x + xCorrection
            }px, ${event.clientY - this.startPositionMouse.y + yCorrection}px)`
        }
    }

    public handleMouseDown = (
        event: React.MouseEvent,
        figureRef: RefObject<HTMLImageElement>,
        cellRef: RefObject<HTMLDivElement>,
        boardRef: RefObject<HTMLDivElement>
    ) => {
        if (figureRef?.current) {
            const figureRect = figureRef.current.getBoundingClientRect()
            this.setIsMouseDown(true)
            this.figureRef = figureRef
            this.cellRef = cellRef
            this.boardRef = boardRef
            const cursorRelativeBoard = {
                x: event.clientX,
                y: event.clientY,
            }
            const offsetStartPositionX =
                cursorRelativeBoard.x - figureRect.left - figureRect.width / 2
            const offsetStartPositionY =
                cursorRelativeBoard.y - figureRect.top - figureRect.height / 2

            this.setStartPositionMouse({
                x: event.clientX - offsetStartPositionX,
                y: event.clientY - offsetStartPositionY,
            })

            figureRef.current.style.transform = `translate(${offsetStartPositionX}px, ${offsetStartPositionY}px)`
        }
    }

    public detectedTargetCell = (cell: Cell | null, event: MouseEvent) => {
        if (this.cellRef?.current && cell) {
            const cellRect = this.cellRef.current.getBoundingClientRect()
            const offsetFigureX =
                event.clientX - this.startPositionMouse.x - cellRect.width / 2
            const offsetFigureY =
                event.clientY - this.startPositionMouse.y - cellRect.height / 2

            const targetCellX = Math.ceil(offsetFigureX / cellRect.width)
            const targetCellY = Math.ceil(offsetFigureY / cellRect.height)

            return cell.board.cells[cell.y + targetCellY][cell.x + targetCellX]
        }
    }
}

export default new moveFigureService()
