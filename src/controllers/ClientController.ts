import { Request, Response } from "express";
import Client from "../models/Client";

export default class ClientController {
  static async create(req: Request, res: Response) {
    const { id, name, username } = req.body;
    if (!id || !name || !username) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const client = new Client({ id, name, username });
      await client.insert();

      return res.status(201).json({ message: "Client added" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
