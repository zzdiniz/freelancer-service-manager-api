import { sign } from "jsonwebtoken";
import { Response } from "express";

const createProviderToken = (providerEmail: string, res: Response) => {
  const token = sign(
    {
      name: providerEmail,
    },
    "secretSP"
  );
  res.status(200).json({
    message: "User authenticated",
    token,
  });
};

export default createProviderToken;
