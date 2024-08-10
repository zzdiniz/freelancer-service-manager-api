import { Router } from "express";
import ClientController from "../controllers/ClientController";

const router = Router();

router.post("/create", ClientController.create);
router.patch("/update", ClientController.update)
router.get("/:id", ClientController.getById);

export default router;
