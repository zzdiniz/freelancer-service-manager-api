import { Request, Response } from "express";
import ProviderInterface from "../types/ProviderInterface";
import Service from "../models/Service";

export default class ServiceController{
    static async addService (req: Request, res: Response){
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
}