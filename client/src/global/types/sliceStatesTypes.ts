import { Colors } from "../../constants/Colors"

export type gameModes = 'bot' | 'online' | 'analis' | null
export type coordinate = { x: number, y: number}

export interface coordinatesCells {
    coordinatesSelectedCell: coordinate,
    coordinatesTargetCell: coordinate,
}

export interface gameState {
    currentMoveCoordinates: coordinatesCells | string | null
    currentColor: Colors
    connected: boolean
    mode: string
}