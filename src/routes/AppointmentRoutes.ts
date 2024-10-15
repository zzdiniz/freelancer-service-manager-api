import { Router } from "express";
import AppointmentController from "../controllers/AppointmentController";
import Appointment from "../models/Appointment";
import verifyProviderToken from "../middlewares/verifyProviderToken";

const router = Router()

router.post('/add',AppointmentController.addAppointment)
router.get('/get-available-dates',AppointmentController.getAvailableDates)
router.get('/get-all-by-provider',verifyProviderToken,AppointmentController.getAll)
router.get('/get-latest',AppointmentController.getLatest)
router.patch('/set-done',verifyProviderToken,AppointmentController.setDone)
router.patch('/update-status',AppointmentController.updateStatus)

export default router