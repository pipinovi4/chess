import { Figure } from "../figures/Figure"
import { Colors } from "../models/Colors"

const getOponentColor = (figure: Figure) => {
    return figure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
}

export default getOponentColor