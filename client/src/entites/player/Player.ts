import { Colors } from '../../constants/Colors'

type typePlayer = 'player' | 'bot'

export class Player {
    color: Colors
    id?: string
    typePlayer: typePlayer

    constructor(color: Colors, typePlayer: typePlayer, userId?: string) {
        this.color = color
        this.id = userId
        this.typePlayer = typePlayer
    }
}
