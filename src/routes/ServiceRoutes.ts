import { Router } from "express";
import ServiceController from "../controllers/ServiceController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router();

router.post("/add-service", verifyProviderToken, ServiceController.addService);

export default router;
