require('dotenv').config()
import express, { Application } from 'express'
import https from 'https'
import expressConfig from './configs/express-config'
import socketConfig from './configs/socketConfig'
import * as fs from 'fs'
import userRoutes from './routes/userRoute'
import errorMiddleware from './middlewares/error-middleware'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongooseConfig from './configs/mongoose-config'
import dataRoutes from './routes/dataRoutes'

const options = {
    key: fs.readFileSync('C:/Users/Пипин/certs/client/client.key'),
    cert: fs.readFileSync('C:/Users/Пипин/certs/client/client.crt'),
}

const app: Application = express()
const httpsServer = https.createServer(options, app)
const allowedOrigins = ['https://localhost:5173']

app.use(express.json({limit: '10mb'}))
app.use(cookieParser())
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
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/authorization', userRoutes)
app.use('/data', dataRoutes)
app.use(errorMiddleware)

const start = () => {
    expressConfig(app)
    socketConfig(httpsServer)
    mongooseConfig()

    httpsServer.listen(process.env.PORT, () => {
        console.log(`Server started port: ${process.env.PORT}`)
    })
}

start()
