import gameStatus from "./gameStatusEnum";

export interface gameData {
    moves: string[];
    users: [string];
    timeStamp: Date;
    status: gameStatus;
}