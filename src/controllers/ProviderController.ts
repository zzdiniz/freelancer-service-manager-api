import { Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
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

    const registeredEmail = await Provider.getByEmail(email)
    if (registeredEmail) {
        return res.status(422).json({ message: "An user with this e-mail already exists." });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    const provider = new Provider({name,email,password:passwordHash})
    try {
        await provider.insert()
        return createProviderToken(provider.getEmail(),res)
    } catch (error) {
        return res.status(500).json({message: error})
    }
  }
}
