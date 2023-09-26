import Router from 'express'
import gameController from '../controllers/gameController'
const router = Router()

router.post('/create-game', gameController.createGame)

export default router
