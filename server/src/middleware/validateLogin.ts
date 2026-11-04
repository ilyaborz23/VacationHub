import type { NextFunction, Request, Response } from "express";
import {
  EMAIL_PATTERN,
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_BYTES,
  MIN_PASSWORD_LENGTH,
  asTrimmed,
} from "./validateRegister";

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body ?? {};
  const email = asTrimmed(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    return;
  }
  if (Buffer.byteLength(password) > MAX_PASSWORD_BYTES) {
    res.status(400).json({ error: "Password is too long" });
    return;
  }

  req.body = { email, password };
  next();
};
