import { Namespace, Socket } from "socket.io"
import searchQueueService from "../services/searchQueueService"


const searchQueue = (server: Namespace) => {

    const onConnection = (socket: Socket) => {
        socket.on('search-opponent', async() => {
            searchQueueService.searchOpponent(socket.id)
        })
    }

    server.on('connection', onConnection)
}

export default searchQueue