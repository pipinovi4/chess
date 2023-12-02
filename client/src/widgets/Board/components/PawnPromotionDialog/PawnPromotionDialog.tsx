/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC } from 'react'
import { Cell } from '../../../../entites/cell/Cell'
import { Figure } from '../../../../entites/figures/Figure'
import { Colors } from '../../../../constants/Colors'
import { Queen } from '../../../../entites/figures/Queen'
import { Knight } from '../../../../entites/figures/Knigt'
import { Rook } from '../../../../entites/figures/Rook'
import { Bishop } from '../../../../entites/figures/Bishop'
import whiteQueen from '../../../../assets/white-queen.png'
import blackQueen from '../../../../assets/black-queen.png'
import whiteRook from '../../../../assets/white-rook.png'
import blackRook from '../../../../assets/black-rook.png'
import whiteBishop from '../../../../assets/white-bishop.png'
import blackBishop from '../../../../assets/black-bishop.png'
import whiteKngiht from '../../../../assets/white-knight.png'
import blackKnight from '../../../../assets/black-knight.png'
import './style.scss'
import moveFigureService from '../../../../services/moveServices/moveFigureService'

interface ModalPickFigureProps {
    cellPawnPromotion: Cell
    setCellPawnPromotion: (targetCell: Cell | null) => void
    selectedCell: Cell
}

const PawnPromotionDialog: FC<ModalPickFigureProps> = ({
    cellPawnPromotion,
    setCellPawnPromotion,
    selectedCell,
}) => {
    const cellRect = document
        .getElementById(cellPawnPromotion.id.toString())
        ?.getBoundingClientRect()
    const handleFigureSelect = (figure: Figure) => {
        if (selectedCell.figure) {
            selectedCell.figure.promotedTo = figure.name[0]
            moveFigureService.handleMoveFigure(cellPawnPromotion, selectedCell)
            selectedCell?.board.highlightCells(null)
            setCellPawnPromotion(null)
            cellPawnPromotion.figure = figure
            selectedCell.figure = null
        }
    }

    return (
        <>
            <div
                className="pawn-promotion__dialog"
                style={{
                    left: cellRect!.width * cellPawnPromotion.x,
                    top: cellRect!.height * cellPawnPromotion.y,
                }}
            >
                <img
                    className="promotion-figure queen"
                    src={
                        selectedCell?.figure?.color === Colors.WHITE
                            ? whiteQueen
                            : blackQueen
                    }
                    alt="queen"
                    onClick={() =>
                        handleFigureSelect(
                            new Queen(
                                selectedCell!.figure!.color,
                                selectedCell!
                            )
                        )
                    }
                />
                <img
                    className="promotion-figure knight"
                    src={
                        selectedCell?.figure?.color === Colors.WHITE
                            ? whiteKngiht
                            : blackKnight
                    }
                    alt="knight"
                    onClick={() =>
                        handleFigureSelect(
                            new Knight(
                                selectedCell!.figure!.color,
                                selectedCell!
                            )
                        )
                    }
                />
                <img
                    className="promotion-figure rook"
                    src={
                        selectedCell!.figure?.color === Colors.WHITE
                            ? whiteRook
                            : blackRook
                    }
                    alt="rook"
                    onClick={() =>
                        handleFigureSelect(
                            new Rook(selectedCell!.figure!.color, selectedCell!)
                        )
                    }
                />
                <img
                    className="promotion-figure bishop"
                    src={
                        selectedCell!.figure?.color === Colors.WHITE
                            ? whiteBishop
                            : blackBishop
                    }
                    alt="bishop"
                    onClick={() =>
                        handleFigureSelect(
                            new Bishop(
                                selectedCell!.figure!.color,
                                selectedCell!
                            )
                        )
                    }
                />
                <div className="close-promotion__dialog">
                    <h2
                        className="button-close__promotion"
                        onClick={() => setCellPawnPromotion(null)}
                    >
                        &times;
                    </h2>
                </div>
            </div>
        </>
    )
}

export default PawnPromotionDialog
