import { Router } from "express";
import ClientController from "../controllers/ClientController";

const router = Router();

router.post("/create", ClientController.create);

export default router;
