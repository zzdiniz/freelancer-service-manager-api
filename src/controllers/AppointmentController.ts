import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import parseToDatetime from "../helpers/parse-to-datetime";
import parseToLocalDate from "../helpers/parse-to-local-date";
import compareDates from "../helpers/compare-dates";
import findAvailableDates from "../helpers/find-available-dates";
import moment from "moment-timezone";

export default class AppointmentController {
  static async addAppointment(req: Request, res: Response) {
    const { datetime, providerId, serviceId, clientId, status } = req.body;

    if (
      !datetime ||
      !providerId ||
      (!serviceId && status !== "unavailable") ||
      (!clientId && status !== "unavailable")
    ) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const scheduledAppointments = await Appointment.getByProviderId(
        providerId
      );
      const conflictingDate =
        scheduledAppointments &&
        scheduledAppointments.find((appointment) => {
          return compareDates(parseToDatetime(datetime), appointment.datetime);
        });
      if (conflictingDate) {
        return res.status(409).json({
          message: `${parseToLocalDate(
            conflictingDate.datetime
          )} already occupied`,
        });
      }

      const appointment = new Appointment({
        datetime: parseToDatetime(datetime),
        status: status ?? "scheduled",
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

  static async getAvailableDates(req: Request, res: Response) {
    const { providerId } = req.query;

    if (!providerId) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const busyDates = await Appointment.getBusyDates(
        parseInt(providerId as string)
      );

      const timezone = "America/Sao_Paulo";
      const startDate = moment
        .tz(timezone)
        .set({ minute: 0, second: 0, millisecond: 0 });
      const endDate = startDate.clone().add(1, "day").endOf("day");

      const formattedStartDate = startDate.format("YYYY-MM-DDTHH:mm:ss");
      const formattedEndDate = endDate.format("YYYY-MM-DDTHH:mm:ss");

      const availableDates = findAvailableDates(
        busyDates,
        formattedStartDate,
        formattedEndDate
      );

      return res.status(200).json(availableDates);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }
}
