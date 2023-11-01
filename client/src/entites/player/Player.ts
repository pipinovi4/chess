import { Colors } from '../../constants/Colors'

export class Player {
    color: Colors
    userName: string

    constructor(color: Colors, userName: string) {
        this.color = color
        this.userName = userName
    }
}
