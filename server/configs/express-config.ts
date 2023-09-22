import express, {Express} from 'express'
import cors from 'cors'
import gameRouter from '../routes/userRoute'
import userRouter from '../routes/userRoute'
import errorMiddleware from '../middlewares/error-middleware'

const expressConfig = (app: Express) => {
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use('/chess', gameRouter)
    app.use('/authorization', userRouter)
    app.use(cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        maxAge: 3600,
        allowedHeaders: 'Content-Type,Authorization',
    }))
    app.use(errorMiddleware)
    return app
}

export default expressConfig 