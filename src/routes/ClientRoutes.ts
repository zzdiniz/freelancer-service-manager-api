import { Router } from "express";
import ClientController from "../controllers/ClientController";

const router = Router();

router.post("/create", ClientController.create);
router.post("/create-conversation", ClientController.createConversation)
router.patch("/update-conversation", ClientController.updateConversation)
router.get("/get-conversation", ClientController.getConversation);
router.get("/:id", ClientController.getById);

export default router;
