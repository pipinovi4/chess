import Router from 'express'
import engineController from '../controllers/engineController'
const router = Router()

router.get('/start-engine', engineController.startEngine)
router.get('/stop-engine', engineController.stopEngine)

export default router