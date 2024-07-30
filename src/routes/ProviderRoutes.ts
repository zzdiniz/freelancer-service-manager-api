import { Router } from "express";
import ProviderController from "../controllers/ProviderController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router();

router.post("/create", ProviderController.create);
router.post("/login", ProviderController.login);
router.post("/add-service", verifyProviderToken, ProviderController.addService);

export default router;
