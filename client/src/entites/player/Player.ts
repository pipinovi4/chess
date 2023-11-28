import { Colors } from '../../constants/Colors'
import UserRequest from '../../requstTypes/UserRequest'

type typePlayer = 'current' | 'opponent'

export class Player {
    color?: Colors
    typePlayer: typePlayer
    userData: UserRequest | null = null

    constructor(typePlayer: typePlayer, userData: UserRequest | null, color?: Colors) {
        this.color = color
        this.userData = userData
        this.typePlayer = typePlayer
    }
}
