import { Request, Response } from 'express'
import GameModel from '../models/GameModel'
import { gameData } from '../types/gameTypes'
import ApiError from '../exceptions/ApiError'

class gameController {
    async createGame(req: Request, res: Response) {
        try {
            const user = req.body
            const gameData = await GameModel.create({
                users: [user],
            })
            if (!gameData) {
                return ApiError.BadRequest('Undefined session game data', [])
            }
            res.status(200).json(gameData)
        } catch (e) {
            return ApiError.UnforseenError()
        }
    }
}

export default new gameController()
