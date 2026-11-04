import "dotenv/config";
import jwt from "jsonwebtoken";
import type { User } from "../types/User";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not set in .env");
}

const secret: string = jwtSecret;

export type TokenPayload = {
  userId: number;
  role: User["role"];
};

export const signToken = (user: User) => {
  const payload: TokenPayload = { userId: user.user_id, role: user.role };
  return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn: "1d" });
};

export const readToken = (token: string) => {
  return jwt.verify(token, secret, { algorithms: ["HS256"] }) as TokenPayload;
};
