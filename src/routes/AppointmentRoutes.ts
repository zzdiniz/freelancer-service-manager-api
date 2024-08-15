import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController";

const router = Router()

router.post('/add',AppointmentController.addAppointment)
router.get('/get-available-dates',AppointmentController.getAvailableDates)

export default router