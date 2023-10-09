import Router from 'express'
import userController from '../controllers/userController'
const router = Router()

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/refresh', userController.refresh)
router.post('/find-auth-data', userController.findAuthData)

export default router
