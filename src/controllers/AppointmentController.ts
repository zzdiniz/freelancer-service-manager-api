import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import parseToDatetime from "../helpers/parse-to-datetime";

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

      if (scheduledAppointments) {
        for (const scheduledAppointment of scheduledAppointments) {
          const date = new Date(scheduledAppointment.datetime);
          date.setHours(date.getHours() - 6);
          const [scheduledDate, scheduledTime] = date.toISOString().split("T");
          const [year, month, day] = scheduledDate.split("-");
          const [hour, minute, second] = scheduledTime.split(":");
          const parsedScheduledDate = `${[day, month, year].join("/")} ${[
            hour,
            minute,
          ].join(":")}`;

          if (parsedScheduledDate === datetime) {
            return res.status(409).json({ message: "Date already occupied" });
          }
        }
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
