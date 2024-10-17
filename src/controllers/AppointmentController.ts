import { Request, Response } from "express";
import Appointment from "../models/Appointment";
import parseToDatetime from "../helpers/parse-to-datetime";
import parseToLocalDate from "../helpers/parse-to-local-date";
import compareDates from "../helpers/compare-dates";
import findAvailableDates from "../helpers/find-available-dates";
import moment from "moment-timezone";
import ProviderInterface from "../types/ProviderInterface";

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
      const endDate = startDate.clone().add(1, "day").endOf("month");
      
      const formattedStartDate = startDate.format("YYYY-MM-DDTHH:mm:ss");
      const formattedEndDate = endDate.format("YYYY-MM-DDTHH:mm:ss");

      const availableDates = findAvailableDates(
        busyDates,
        formattedStartDate,
        formattedEndDate
      );

      return res.status(200).json(availableDates.slice(0,9));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const appointment = await Appointment.getById(id);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      await Appointment.updateStatus(id, status);

      return res.status(201).json({ message: "updated" });
    } catch (error) {
      return res.status(500).json({ messsage: error });
    }
  }

  static async getLatest(req: Request, res: Response) {
    const { providerId, clientId } = req.query;

    if (!providerId || !clientId) {
      return res.status(422).json({ message: "missing required fields" });
    }

    try {
      const appointment = await Appointment.getLatest(
        parseInt(providerId as string),
        parseInt(clientId as string)
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      return res.status(200).json(appointment);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async getAll(req: Request, res: Response) {
    const provider = res.locals.provider as ProviderInterface;

    try {
      const appointments = await Appointment.getByProviderId(
        provider.id as number
      );

      if (!appointments) {
        return res.status(404).json({ message: "No appointments found" });
      }

      return res.status(200).json(appointments);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async setDone(req: Request, res: Response) {
    const provider = res.locals.provider as ProviderInterface;
    const currentDateTime = moment
      .tz("America/Sao_Paulo")
      .format("YYYY-MM-DD HH:mm:ss");

    try {
      await Appointment.setDone(
        provider?.id as number,
        currentDateTime.toString()
      );
      return res.status(201).json({ message: "Appointments updated!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async addReview(req: Request, res: Response) {
    const { appointmentId, review } = req.body;

    if (!appointmentId || !review) {
      return res.status(422).json({ message: "Missing required fields" });
    }
    if (review < 0 || review > 5) {
      return res.status(422).json({ message: "Invalid review" });
    }

    try {
      await Appointment.addReview(appointmentId, review);
      return res.status(201).json({ message: "Review added" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
