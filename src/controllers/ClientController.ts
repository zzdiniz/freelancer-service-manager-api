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
  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(422).json({ message: "Missing id" });
    }

    try {
      const client = await Client.getById(parseInt(id));

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      return res.status(200).json(client);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async update(req: Request, res: Response) {
    const { id, name, username, conversationState } = req.body;

    if (!id) {
      return res.status(422).json({ message: "Id is required" });
    }
    try {
      const client = await Client.getById(parseInt(id));
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      client.name = name ?? client.name;
      client.username = username ?? client.username;
      client.conversationState = conversationState ?? client.conversationState;

      await Client.update({
        id: client.id,
        name: client.name,
        username: client.username,
        conversationState: client.conversationState,
      });
      return res.status(200).json({ message: "Updated" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
