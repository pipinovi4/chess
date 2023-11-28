import { Router } from "express";
import GetDataService from "../services/GetDataService";
const router = Router()

router.post('/get-user', GetDataService.getUserById)
router.get('/get-current-user', GetDataService.getCurrentUserId)

export default router