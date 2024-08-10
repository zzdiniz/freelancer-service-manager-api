import { Request, Response } from "express";
import Client from "../models/Client";
import Provider from "../models/Provider";

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
  static async createConversation(req: Request, res: Response) {
    const { providerId, clientId } = req.body;

    if (!providerId || !clientId) {
      return res.status(422).json({ message: "Missing required fields" });
    }
    try {
      const client = await Client.getById(parseInt(clientId));
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      const provider = await Provider.getById(parseInt(providerId));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      await Client.createConversation({
        providerId,
        clientId,
        conversationState: "initial_message",
      });
      return res.status(200).json({ message: "Created" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async updateConversation(req: Request, res: Response) {
    const { providerId, clientId, conversationState } = req.body;

    if (!providerId || !clientId || !conversationState) {
      return res.status(422).json({ message: "Missing required fields" });
    }
    try {
      const client = await Client.getById(parseInt(clientId));
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      const provider = await Provider.getById(parseInt(providerId));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      await Client.updateConversation({
        providerId,
        clientId,
        conversationState,
      });
      return res.status(200).json({ message: "Updated" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
  static async getConversation(req: Request, res: Response) {
    const { providerId, clientId } = req.query;

    if (!providerId || !clientId) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    try {
      const conversation = await Client.getConversation(
        parseInt(providerId as string),
        parseInt(clientId as string)
      );

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
