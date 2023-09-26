import { Figure } from '../Figure'
import { Colors } from '../../../constants/Colors'

const getOponentColor = (figure: Figure) => {
    return figure.color === Colors.WHITE ? Colors.BLACK : Colors.WHITE
}

export default getOponentColor
