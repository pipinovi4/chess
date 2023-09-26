import Router from 'express'
const router = Router()
import chatController from '../controllers/chatController'

router.post('/create-chat', chatController.createChat)

export default router
