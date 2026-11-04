import type { NextFunction, Request, Response } from "express";
import type { User } from "../types/User";

export const requireRole = (role: User["role"]) => (req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user?.role !== role) {
    res.status(403).json({ error: "You do not have permission to do this" });
    return;
  }
  next();
};
