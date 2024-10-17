import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import Provider from "../models/Provider";
import createProviderToken from "../helpers/create-provider-token";
import getProviderToken from "../helpers/get-provider-token";
import { JwtPayload, verify } from "jsonwebtoken";
import ProviderInterface from "../types/ProviderInterface";
import Bot from "../models/Bot";
import TelegramBot from "node-telegram-bot-api";
import Appointment from "../models/Appointment";
import Service from "../models/Service";
import moment from "moment";

export default class ProviderController {
  static async create(req: Request, res: Response) {
    const { name, email, password, confirmedPassword } = req.body;

    if (!name || !email || !password || !confirmedPassword) {
      return res.status(422).json({ message: "All fields are required" });
    }

    if (password !== confirmedPassword) {
      return res.status(422).json({ message: "Passwords must match" });
    }

    const registeredEmail = await Provider.getByEmail(email);
    if (registeredEmail) {
      return res
        .status(422)
        .json({ message: "An user with this e-mail already exists." });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    const provider = new Provider({ name, email, password: passwordHash });
    try {
      await provider.insert();
      return createProviderToken(`${provider.id}`, res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ message: "All fields are required" });
    }

    const provider = await Provider.getByEmail(email);
    if (!provider) {
      return res
        .status(404)
        .json({ message: `There is no user with email '${email}'` });
    }

    const isCorrectPassword = await compare(password, provider.password);
    if (!isCorrectPassword) {
      return res.status(422).json({ message: "Password invalid" });
    }

    return createProviderToken(`${provider.id}`, res);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ message: "You must send a valid Id" });
    }

    try {
      const provider = await Provider.getById(parseInt(id));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      return res
        .status(200)
        .json({ id: provider.id, name: provider.name, email: provider.email });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async sendMessageRequest(req: Request, res: Response) {
    const { providerId, clientId, message } = req.body;

    if (!providerId || !clientId || !message) {
      res.status(422).json({ message: "Missing required fields" });
    }

    try {
      await Provider.sendMessageRequest({
        clientId,
        message,
        providerId,
        status: "pending_response",
      });

      return res.status(201).json({ message: "Request sent" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async validate(req: Request, res: Response) {
    if (req.headers.authorization) {
      const token = getProviderToken(req);
      if (!token) {
        return res
          .status(422)
          .json({ message: "Authorization token was not sent" });
      }
      const tokenDecoded = verify(token, "secretSP") as JwtPayload;
      const currentUser = await Provider.getById(tokenDecoded.id);
      if (!currentUser) {
        return res.status(404).json({ message: "Provider not found" });
      }

      return res.status(200).json({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      });
    }
    return res
      .status(422)
      .json({ message: "Authorization token was not sent" });
  }

  static async getMessageRequests(req: Request, res: Response) {
    const provider = res.locals.provider as ProviderInterface;

    try {
      const requests = await Provider.getMessageRequests(provider.id as number);
      return res.status(200).json({ requests });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async respondMessageRequest(req: Request, res: Response) {
    const provider = res.locals.provider as ProviderInterface;
    const { requestId, clientId, response } = req.body;

    if (!requestId || !clientId || !response) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const botData = await Bot.getByProviderId(provider.id as number);
      const telegramBot = new TelegramBot(botData?.token as string);

      await telegramBot.sendMessage(clientId, response);

      await Provider.updateMessageRequest(requestId);

      return res.status(200).json({ message: "message sent" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async getMetrics(req: Request, res: Response) {
    const provider = res.locals.provider as ProviderInterface;

    try {
      const appointments = await Appointment.getByProviderId(
        provider?.id as number
      );

      const services = await Service.getByProviderId(provider?.id as number);

      const timezone = "America/Sao_Paulo";
      const startOfMonth = moment.tz(timezone).startOf("month");
      const endOfMonth = moment.tz(timezone).endOf("month");

      const monthAppointments =
        appointments?.filter((appointment) => {
          const parsedDatetime = moment.tz(appointment.datetime, timezone);

          return (
            parsedDatetime.isBetween(startOfMonth, endOfMonth) &&
            appointment.status !== "unavailable"
          );
        }) ?? [];

      const finishedAppointments = monthAppointments?.filter(
        (appointment) => appointment.status === "done"
      );
      const monthEarnings = finishedAppointments?.reduce(
        (total, appointment) => {
          const currentService = services?.find(
            (service) => service.id === appointment.serviceId
          );

          return currentService ? total + currentService.price : total;
        },
        0
      );

      const averageTicket =
        (finishedAppointments ?? []).length > 0
          ? (monthEarnings ?? 0) / (finishedAppointments ?? []).length
          : 0;

      const cancellations = monthAppointments?.filter(
        (appointment) => appointment.status === "canceled"
      ).length;
      const cancellationRate =
        monthAppointments.length > 0
          ? (cancellations / monthAppointments.length) * 100
          : 0;

      const uniqueClients = new Set<number>();
      const recurringClients = new Set<number>();

      appointments?.forEach((appointment) => {
        if (appointment.clientId) {
          if (uniqueClients.has(appointment.clientId)) {
            recurringClients.add(appointment.clientId);
          } else {
            uniqueClients.add(appointment.clientId);
          }
        }
      });

      const retentionRate = (recurringClients.size / uniqueClients.size) * 100;

      const serviceFrequency: Record<number, number> = {};
      finishedAppointments.forEach((appointment) => {
        if (appointment.serviceId) {
          if (serviceFrequency[appointment.serviceId]) {
            serviceFrequency[appointment.serviceId]++;
          } else {
            serviceFrequency[appointment.serviceId] = 1;
          }
        }
      });

      const mostFrequentServiceId = Object.keys(serviceFrequency).reduce(
        (a, b) =>
          serviceFrequency[parseInt(a)] > serviceFrequency[parseInt(b)] ? a : b
      );

      const ratings = finishedAppointments
        .filter((appointment) => appointment.review)
        .map((appointment) => appointment.review as number);

      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

      return res.status(200).json({
        monthEarnings,
        averageTicket,
        cancellationRate,
        retentionRate,
        mostFrequentServiceId,
        averageRating,
      });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
