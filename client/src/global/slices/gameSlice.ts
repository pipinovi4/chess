import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Colors } from '../../constants/Colors';
import { gameState, coordinatesCells } from '../types/sliceStatesTypes';

const botGameState: gameState = {
    currentMoveCoordinates: null,
    currentColor: Colors.WHITE,
    connected: false,
    mode: ''
};

const botGameSlice = createSlice({
    name: 'game',
    initialState: botGameState,
    reducers: {
        addMove: (state, action: PayloadAction<coordinatesCells | string>) => {
            if (typeof action.payload === 'string') {
                return {
                    ...state,
                    currentMoveCoordinates: action.payload
                };
            } else if (typeof action.payload === 'object' && action.payload !== null) {
                if ('property' in action.payload) {
                    return {
                        ...state,
                        currentMoveCoordinates: action.payload
                    };
                } else {
                    console.error('Unreleased type in addmove editor')
                    return state
                }
            }
            return state;
        },        

        setCurrentColor: (state, action: PayloadAction<Colors>) => {
            return {
                ...state,
                currentColor: action.payload
            };
        },

        setConnected: (state, action: PayloadAction<boolean>) => {
            return {
                ...state,
                connected: action.payload
            };
        },

        setMode: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                mode: action.payload
            };
        }
    },
});

export const { addMove, setCurrentColor, setConnected, setMode } = botGameSlice.actions;

export default botGameSlice.reducer;
