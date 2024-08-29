import { Request, Response } from "express";
import { genSalt, hash, compare } from "bcrypt";
import Provider from "../models/Provider";
import createProviderToken from "../helpers/create-provider-token";

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
      return createProviderToken(provider.getEmail(), res);
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

    return createProviderToken(provider.email, res);
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
    const { providerId, clientId, message} = req.body;

    if (!providerId || !clientId || !message) {
      res.status(422).json({ message: "Missing required fields" });
    }

    try {
      await Provider.sendMessageRequest({
        clientId,
        message,
        providerId,
        status: "pending_response"
      });

      return res.status(201).json({ message: "Request sent" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
