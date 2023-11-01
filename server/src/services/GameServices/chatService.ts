import ApiError from '../../exceptions/ApiError'
import ChatModel from '../../models/DB/ChatModel'

class chatService {
    async createChat(users: Array<string>) {
        const chatData = await ChatModel.create({
            users,
        })
        if (!chatData) {
            throw ApiError.UnforseenError()
        }
        return chatData
    }
}

export default new chatService()
