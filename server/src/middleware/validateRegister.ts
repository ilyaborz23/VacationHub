import type { NextFunction, Request, Response } from "express";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 4;

const MAX_PASSWORD_BYTES = 72;

const asTrimmed = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body ?? {};
  const firstName = asTrimmed(body.first_name);
  const lastName = asTrimmed(body.last_name);
  const email = asTrimmed(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  if (firstName.length > MAX_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
    res.status(400).json({ error: `Names cannot be longer than ${MAX_NAME_LENGTH} characters` });
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

  req.body = { first_name: firstName, last_name: lastName, email, password };
  next();
};
