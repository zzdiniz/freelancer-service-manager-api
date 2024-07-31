import { Request, Response } from "express";
import ProviderInterface from "../types/ProviderInterface";
import Service from "../models/Service";

export default class ServiceController {
  static async addService(req: Request, res: Response) {
    const { name, description, price, faq } = req.body;
    const provider = res.locals.provider as ProviderInterface;

    if (!name || !description || !price) {
      return res.status(422).json({ message: "Missing required fields." });
    }

    try {
      await Service.addService({
        name,
        description,
        price,
        providerId: provider.id as number,
        faq,
      });
      return res.status(201).json({ message: "Service added." });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async getByProviderId(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(422)
        .json({ message: "You must send a valid provider id" });
    }

    try {
      const services = await Service.getByProviderId(parseInt(id));
      if (!services) {
        return res.status(404).json({ message: "No services were found" });
      }
      return res.status(200).json(services);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
