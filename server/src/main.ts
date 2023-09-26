require('dotenv').config()
import express, { Application } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import https from 'https'
import expressConfig from './configs/express-config'
import mongooseConfig from './configs/mongoose-config'
import socketConfig from './configs/socketConfig'
import fs from 'fs'
import gameRoutes from './routes/userRoute'
import userRoutes from './routes/userRoute'
import chatRoutes from './routes/chatRoute'
import engineRoutes from './routes/engineRoute'
import errorMiddleware from './middlewares/error-middleware'
import cors from 'cors'

const options = {
    key: fs.readFileSync('C:/Users/Пипин/chess/certs/client/client.key'),
    cert: fs.readFileSync('C:/Users/Пипин/chess/certs/client/client.crt'),
}

const app: Application = express()
const httpsServer = https.createServer(options, app)
const io: SocketIOServer = new SocketIOServer(httpsServer, {
    cors: {
        origin: 'https://localhost:5173',
    },
})
const allowedOrigins = ['https://localhost:5173']

app.use(express.json())
app.use('/chess', gameRoutes)
app.use('/authorization', userRoutes)
app.use('/chat', chatRoutes)
app.use('/engine', engineRoutes)
app.use(express.urlencoded({ extended: true }))
app.use(errorMiddleware)
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
        credentials: true,
    })
)

const start = () => {
    expressConfig(app)
    mongooseConfig()
    socketConfig(io)

    httpsServer.listen(process.env.PORT, () => {
        console.log(`Server started port: ${process.env.PORT}`)
    })
}

start()
