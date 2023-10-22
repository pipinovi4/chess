import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import socketMiddleware from './middlewares/socketMiddleware'
import rootSaga from './saga/gameWithBotSaga'
import gameReducer from './slices/gameSlice'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
    reducer: gameReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware, socketMiddleware()),
})

sagaMiddleware.run(rootSaga)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
