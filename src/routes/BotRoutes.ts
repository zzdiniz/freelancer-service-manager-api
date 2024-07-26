import { Router } from "express";
import BotController from "../controllers/BotController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router()

router.post('/create',verifyProviderToken,BotController.create)

export default router