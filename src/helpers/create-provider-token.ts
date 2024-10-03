import { sign } from "jsonwebtoken";
import { Response } from "express";

const createProviderToken = (providerId: string, res: Response) => {
  const token = sign(
    {
      id: providerId,
    },
    "secretSP"
  );
  res.status(200).json({
    message: "User authenticated",
    token,
  });
};

export default createProviderToken;
