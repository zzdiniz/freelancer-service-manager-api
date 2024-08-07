import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import parseToDatetime from "../helpers/parse-to-datetime";
import parseToLocalDate from "../helpers/parse-to-local-date";
import compareDates from "../helpers/compare-dates";

export default class AppointmentController {
  static async addAppointment(req: Request, res: Response) {
    const { datetime, providerId, serviceId, clientId } = req.body;

    if (!datetime || !providerId || !serviceId || !clientId) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const scheduledAppointments = await Appointment.getByProviderId(
        providerId
      );
      const conflictingDate = scheduledAppointments && scheduledAppointments.find((appointment)=>{
        return compareDates(parseToDatetime(datetime),appointment.datetime)
      })
      if(conflictingDate){
        return res.status(409).json({ message: `${parseToLocalDate(conflictingDate.datetime)} already occupied` });
      }

      const appointment = new Appointment({
        datetime: parseToDatetime(datetime),
        status: "scheduled",
        providerId,
        serviceId,
        clientId,
      });
      await appointment.insert();

      return res.status(201).json({ message: "Scheduled!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
