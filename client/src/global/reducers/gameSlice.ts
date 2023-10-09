import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Colors } from "../../constants/Colors";

interface gameState {
    connected: boolean
    users: string[] | []
    gameId: string
    whiteTime: number | null
    blackTime: number | null
    moves: string[] | []
    currentTurn: Colors
    blackUserName: string
    whiteUserName: string
}

const gameInitialState: gameState = {
    connected: false,
    users: [],
    gameId: '',
    whiteTime: null,
    blackTime: null,
    moves: [],
    currentTurn: Colors.WHITE,
    blackUserName: '',
    whiteUserName: ''
}

const gameSlice = createSlice({
    name: 'game',
    initialState: gameInitialState,
    reducers: {
        setGameId: (state, action: PayloadAction<string>) => {
            return {...state , gameId: action.payload}
        },
        setUsers: (state, action: PayloadAction<Array<string>>) => {
            return {...state, users: action.payload}
        }
    }
})