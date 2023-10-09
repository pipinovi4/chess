import { Cell } from "../../entites/cell/Cell";


class MoveFigure {
    selectedCell: Cell | null = null

    public setSelectedCell(selectedCell: Cell | null) {
        this.selectedCell = selectedCell
        console.log('selected', this.selectedCell)
    }
}

export default new MoveFigure()