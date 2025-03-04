import { Router } from "express";
import BotController from "../controllers/BotController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router()

router.post('/create',verifyProviderToken,BotController.create)
router.get('/get-by-username',BotController.getByUsername)
router.get('/get-by-id/:id',BotController.getById)
router.get('/get-by-provider-id/:id',BotController.getByProviderId)

export default router