import ApiError from "../exceptions/ApiError"
import GameModel from "../models/GameModel"
import UserModel from "../models/UserModel"
import gameStatus from "../types/gameStatusEnum"

class gameService {
    async createGame(usersSocketId: Array<string>) {
        try {
            if (!usersSocketId || usersSocketId.length !== 2) {
                throw ApiError.BadRequest("Invalid number of users for game creation")
            }
            const game = await GameModel.create({
                usersSocketId
            })
            if (!game) {
                throw ApiError.UnforseenError()
            }
            return game._id
        } catch (e) {
            console.error(`Error in gameService.createGame: ${e.message}`)
            throw ApiError.UnforseenError()
        }
    }

    async updateMovesGame(move: string, gameId: string) {
        try {
            if (!move) {
                throw ApiError.BadRequest('Move undefined')
            }
            if (!gameId) {
                throw ApiError.BadRequest('GameId undefined');
            }
            const game = await GameModel.findById( gameId );
    
            if (!game) {
                throw ApiError.BadRequest('Игра не найдена');
            }
    
            game.moves.push(move); 
            await game.save();
            return game
        } catch (error) {
            console.error('Произошла ошибка при обновлении ходов игры:', error);
            throw ApiError.UnforseenError()
        }
    }

    async endGame(status: gameStatus, userSocketId: string, gameId: string) {
        if (!status) {
            throw ApiError.BadRequest('Status is not defined')
        }
        if (!userSocketId) {
            throw ApiError.BadRequest('User is not defined')
        }
        const game = await GameModel.findById( gameId );

        game.status = status
        await game.save()
    }
}

export default new gameService()