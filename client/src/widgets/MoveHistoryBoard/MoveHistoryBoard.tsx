/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react'
import './style.scss'
import Board from '../../entites/board/Board'
import MovesHistory from './components/MovesHistory/MovesHistory'
import ControllersHistoryMoves from './components/ControllersHistoryMoves/ControllersHistoryMoves'
import _ from 'lodash'
import AnimationMoveFigureServer from '../../services/moveServices/AnimationMoveFigureServer'
import convertAlgebraicNotation from '../../helpers/convertersNotation/convertAlgebraicNotation'
import { Cell } from '../../entites/cell/Cell'

interface MoveHistoryBoardProps {
    board: Board
    setBoard: React.Dispatch<React.SetStateAction<Board>>
}

const MoveHistoryBoard: FC<MoveHistoryBoardProps> = ({ board, setBoard }) => {
    const [historyMoves, setHistoryMoves] = useState<string[]>([])
    const [currentViewedIndexMove, setCurrentViewedIndexMove] =
        useState<number>(0)
    const [boardHistory, setBoardHistory] = useState<Board[]>(() => {
        const initialBoard = new Board()
        initialBoard.lostFigures = []
        initialBoard.initCells()
        initialBoard.addFigures()
        return [initialBoard]
    })
    const [isMainBoard, setIsMainBoard] = useState(true)

    useEffect(() => {
        if (isMainBoard && board.historyMoves.length > 0) {
            const clonedBoard = _.cloneDeep(board)
            setHistoryMoves(clonedBoard.historyMoves)
            setCurrentViewedIndexMove(clonedBoard.historyMoves.length - 1)
            setBoardHistory((prev) => {
                const newHistory = [...prev, clonedBoard]
                return newHistory
            })
            console.log(boardHistory)
        }
        setIsMainBoard(true)
    }, [board.historyMoves.length])

    const makeAnimationMove = (
        isBackMove: boolean,
        targetCell: Cell,
        selectedCell: Cell,
        targetIsFigure: boolean
    ) => {
        const toMove = isBackMove ? selectedCell : targetCell
        const fromMove = isBackMove ? targetCell : selectedCell
        AnimationMoveFigureServer.soundMove(toMove, fromMove, targetIsFigure)
    }

    const handleChangeCurrentViewedMove = (newCurrentIndexMove: number) => {
        setIsMainBoard(false)
        const mama = boardHistory[newCurrentIndexMove]
        const cellsRegax =
            /^([A-Z]?)([a-h][1-8])(x?)([A-Z]?)([a-h][1-8])([=][A-Z])?([+])?$/

        const notationMove = historyMoves[newCurrentIndexMove]
        const resultRegaxCells = notationMove.match(cellsRegax)
        console.log(notationMove, resultRegaxCells)
        const selectedCellKing =
            newCurrentIndexMove % 2 === 0
                ? mama.getCell(4, 0)
                : mama.getCell(4, 7)
        if (notationMove === 'O-O') {
            makeAnimationMove(
                currentViewedIndexMove > newCurrentIndexMove,
                newCurrentIndexMove % 2 === 0
                    ? mama.getCell(6, 0)
                    : mama.getCell(6, 7),
                selectedCellKing,
                false
            )
        } else if (notationMove === 'O-O-O') {
            makeAnimationMove(
                currentViewedIndexMove > newCurrentIndexMove,
                selectedCellKing,
                newCurrentIndexMove % 2 === 0
                    ? mama.getCell(2, 0)
                    : mama.getCell(2, 7),
                false
            )
        } else if (resultRegaxCells) {
            const coordinatesCells = convertAlgebraicNotation(
                resultRegaxCells[2].concat(resultRegaxCells[5])
            )
            console.log(coordinatesCells)
            if (coordinatesCells?.selectedCell && coordinatesCells.targetCell) {
                const selectedCell = mama.getCell(
                    coordinatesCells?.selectedCell.x,
                    coordinatesCells?.selectedCell.y
                )
                const targetCell = mama.getCell(
                    coordinatesCells?.targetCell.x,
                    coordinatesCells?.targetCell.y
                )
                if (currentViewedIndexMove > newCurrentIndexMove) {
                    makeAnimationMove(
                        currentViewedIndexMove > newCurrentIndexMove,
                        targetCell,
                        selectedCell,
                        selectedCell.figure !== null
                    )
                } else if (currentViewedIndexMove < newCurrentIndexMove) {
                    makeAnimationMove(
                        currentViewedIndexMove > newCurrentIndexMove,
                        selectedCell,
                        targetCell,
                        targetCell.figure !== null
                    )
                }
            }
        }
        setBoard(boardHistory[newCurrentIndexMove + 1])
        boardHistory[newCurrentIndexMove + 1].highlightCells(null)
        setCurrentViewedIndexMove(newCurrentIndexMove)
    }

    return (
        <div className="container-moves__history">
            <MovesHistory
                currentViewedIndexMove={currentViewedIndexMove}
                handleChangeCurrentViewedMove={handleChangeCurrentViewedMove}
                historyMoves={historyMoves}
            />
            <ControllersHistoryMoves
                historyMoves={historyMoves}
                currentViewedIndexMove={currentViewedIndexMove}
                handleChangeCurrentViewedMove={handleChangeCurrentViewedMove}
            />
        </div>
    )
}

export default MoveHistoryBoard
