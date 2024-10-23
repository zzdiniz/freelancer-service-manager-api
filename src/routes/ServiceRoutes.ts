import { Router } from "express";
import ServiceController from "../controllers/ServiceController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router();

router.post("/add-service", verifyProviderToken, ServiceController.addService);
router.get("/get-by-provider/:id", ServiceController.getByProviderId);
router.patch("/update",ServiceController.updateService)
router.get("/:id", ServiceController.getByServiceId);

export default router;
