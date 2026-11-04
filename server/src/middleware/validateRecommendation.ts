import type { NextFunction, Request, Response } from "express";
import { asTrimmed } from "./validateRegister";

const MAX_DESTINATION_LENGTH = 100;

export const validateRecommendation = (req: Request, res: Response, next: NextFunction) => {
  const destination = asTrimmed(req.body?.destination);

  if (!destination) {
    res.status(400).json({ error: "Destination is required" });
    return;
  }
  if (destination.length > MAX_DESTINATION_LENGTH) {
    res.status(400).json({ error: `Destination cannot be longer than ${MAX_DESTINATION_LENGTH} characters` });
    return;
  }

  req.body = { destination };
  next();
};
