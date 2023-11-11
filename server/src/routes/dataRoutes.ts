import { Router } from "express";
import GetDataService from "../services/GetDataService";
const router = Router()

router.post('/get-user', GetDataService.getUserById)


export default router