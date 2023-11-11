import { NextFunction, Request, Response } from 'express'

class chatController {
    async createChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { users } = req.body
            if (users.length < 2) {
                next()
            }
        } catch (e) {
            next(e)
        }
    }
}

export default new chatController()
