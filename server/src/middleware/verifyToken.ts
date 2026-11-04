import type { NextFunction, Request, Response } from "express";
import { readToken } from "../utils/jwt";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    res.locals.user = readToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
