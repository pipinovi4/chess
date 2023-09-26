import { NextFunction, Request, Response } from 'express'
import chatService from '../services/chatService'

class chatController {
    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { users } = req.body
            if (users.length < 2) {
                next()
            }
            const chatData = await chatService.createChat(users)
            return res.status(200).json(chatData)
        } catch (e) {
            next(e)
        }
    }
}

export default new chatController()
