import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Figure, FigureNames } from "../../entites/figures/Figure";
import { Cell } from "../../entites/cell/Cell";
import { Colors } from "../../constants/Colors";

interface boardState {
    selectedCell: Cell | null
}

const boardState = {
    selectedCell = null
}

const figureSlice = createSlice({
    name: 'figures',
    initialState: boardState,
    reducers: {
        handleFigureMove: (state, action: PayloadAction<>) {
            const handleFigureMove = (cell: Cell) => {
                if (
                  state.selectedCell &&
                  state.selectedCell !== cell &&
                  state.selectedCell.figure?.canMove(cell)
                ) {
                  if (state.selectedCell.figure.name === FigureNames.PAWN) {
                    const promotionCell =
                      state.selectedCell.figure?.color === Colors.WHITE ? 0 : 7;
              
                    if (cell.y === promotionCell) {
                      setActiveModal(true);
                    }
                  }
                  selectedCell.moveFigure(cell);
                  setSelectedCell(null);
                } else {
                  setSelectedCell(cell);
                }
              };
        }
    }
})