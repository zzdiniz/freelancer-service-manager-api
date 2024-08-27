import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController";
import Appointment from "../models/Appointment";

const router = Router()

router.post('/add',AppointmentController.addAppointment)
router.get('/get-available-dates',AppointmentController.getAvailableDates)
router.patch('/update-status',AppointmentController.updateStatus)

export default router