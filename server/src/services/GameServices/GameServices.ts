// import { Socket } from "socket.io";
// import QueueModel from "../../models/QueueModel";
// import * as uuid from 'uuid'

// class GameService {
//     public async startGame(socket: Socket, QUEUE: QueueModel, roomId: string) {
//         QUEUE.addToQueue(socket.id);
//         const matchingPlayer = await QUEUE.findMatchingPlayer(socket.id);
//         if (matchingPlayer) {
//             roomId = uuid.v4();
//             socket.join(roomId);
//             socket.emit(`matching-player-${matchingPlayer}`, matchingPlayer, roomId);
//             socket.on('connected-user', () => {
//                 socket.emit('game-started')
//             })
//         } else {
//             socket.once(`matching-player-${socket.id}`, (player: string, roomId: string) => {
//                 socket.join(roomId);
//                 socket.to(roomId).emit(`conected-user`);
//                 socket.emit('game-started')
//             });
//         }
//     }

//     async public sendMove() {

//     }

//     async stopGame() {

//     }
// }