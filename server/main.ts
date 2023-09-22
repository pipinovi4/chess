require('dotenv').config()
import express, { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import expressConfig from "./configs/express-config";
import mongooseConfig from "./configs/mongoose-config";
import socketConfig from "./configs/socketConfig";

const start = () => {
    const app: Express = express();
    const httpServer: http.Server = http.createServer(app);
    const io: SocketIOServer = new SocketIOServer(httpServer);

    expressConfig(app);
    mongooseConfig();
    socketConfig(io);

    httpServer.listen(process.env.PORT, () => {
        console.log(`Server started port: ${process.env.PORT}`);
    });
}

start();
