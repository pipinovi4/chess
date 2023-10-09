import ApiError from "../exceptions/ApiError"
import SearchQueue from "../models/SearchQueue"

class searchQueueService {
    async searchOpponent(socketId: string) {
        try {
            if (!socketId) {
                throw ApiError.BadRequest('socketId is not defined')
            }
            await SearchQueue.create({
                socketId
            })
            const opponentSocketId = SearchQueue.find()
            return opponentSocketId
        } catch (e) {
            console.error(e)
            throw ApiError.UnforseenError()
        }
    }
}

export default new searchQueueService()
