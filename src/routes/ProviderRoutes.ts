import { Router } from "express";
import ProviderController from "../controllers/ProviderController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router();

router.post("/create", ProviderController.create);
router.post("/login", ProviderController.login);
router.post("/send-message-request", ProviderController.sendMessageRequest)
router.post("/respond-message-request",verifyProviderToken,ProviderController.respondMessageRequest)
router.get("/validate",ProviderController.validate)
router.get("/get-message-requests",verifyProviderToken,ProviderController.getMessageRequests)
router.get("/get-metrics",verifyProviderToken,ProviderController.getMetrics)
router.patch("/update",verifyProviderToken,ProviderController.updateProvider)
router.get("/:id", ProviderController.getById)

export default router;
