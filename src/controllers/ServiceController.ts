import { Request, Response } from "express";
import ProviderInterface from "../types/ProviderInterface";
import Service from "../models/Service";
import ServiceInterface from "../types/ServiceInterface";

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

  static async getByServiceId(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(422).json({ message: "You must send an id." });
    }

    try {
      const service = await Service.getByServiceId(parseInt(id));
      if (!service) {
        res.status(404).json({ message: "Service not found" });
      }

      return res.status(200).json(service);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  static async updateService(req: Request, res: Response) {
    const { id } = req.query;
    const { name, description, price, faq } = req.body;

    if (!id) {
      return res
        .status(422)
        .json({ message: "You must send a valid service id." });
    }

    try {

      const existingService = await Service.getByServiceId(
        parseInt(id as string)
      );
      if (!existingService) {
        return res.status(404).json({ message: "Service not found." });
      }

      await Service.updateService(
        parseInt(id as string),
        {
          name: name ?? existingService.name,
          description: description ?? existingService.description,
          price: price ?? existingService.price,
        },
        faq ? JSON.stringify(faq) : JSON.stringify(existingService.faq)
      );

      return res.status(200).json({ message: "Service updated." });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
