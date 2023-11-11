import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import OnlineGameModel from '../../../models/customModels/OnlineGameModel';

interface CustomOnlineGameSocket extends Socket {
  receiveGameData: (roomId: string, gameId: Types.ObjectId) => Promise<void>;
  getGameMove: (move: string) => Promise<void>;
}

export default CustomOnlineGameSocket;
