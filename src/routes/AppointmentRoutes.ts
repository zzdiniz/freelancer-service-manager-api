import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router()

router.post('/add',AppointmentController.addAppointment)

export default router