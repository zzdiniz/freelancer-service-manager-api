import { Router } from "express";
import ProviderController from "../controllers/ProviderController";

const router = Router()

router.post('/create',ProviderController.create)
router.post('/login',ProviderController.login)

export default router
