import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import Provider from "../models/Provider";

const verifyProviderToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "You must send a valid token" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const tokenDecoded = verify(token, "secretSP") as JwtPayload;
    const provider = await Provider.getById(tokenDecoded.id);

    if(!provider){
      return res.status(404).json({message: 'Provider not found'})
    }
    res.locals.provider = provider;

    next();
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export default verifyProviderToken;
