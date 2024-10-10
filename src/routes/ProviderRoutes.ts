import { Router } from "express";
import ProviderController from "../controllers/ProviderController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router();

router.post("/create", ProviderController.create);
router.post("/login", ProviderController.login);
router.post("/send-message-request", ProviderController.sendMessageRequest)
router.get("/validate",ProviderController.validate)
router.get("/get-message-requests",verifyProviderToken,ProviderController.getMessageRequests)
router.get("/:id", ProviderController.getById)

export default router;
