import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app)

const start = () => {
    server.listen(5001, () => console.log('Server started port: 5001'))
}

start()