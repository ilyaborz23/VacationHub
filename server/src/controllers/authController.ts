import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { sql } from "../db/connect";
import { signToken } from "../utils/jwt";
import type { User } from "../types/User";

const SALT_ROUNDS = 10;
// Compared when the email is unknown, so both failed login cases take the same time
const DUMMY_HASH = bcrypt.hashSync("no-such-user", SALT_ROUNDS);

//register
export const register = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = (await sql`
      INSERT INTO users (first_name, last_name, email, password)
      VALUES (${first_name}, ${last_name}, ${email}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
      RETURNING user_id, first_name, last_name, email, role
    `) as User[];
    if (!user) {
      res.status(409).json({ error: "Email is already taken" });
      return;
    }
    res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    res.status(500).json({ error: "Failed to register" });
  }
};

//login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const [row] = (await sql`
      SELECT user_id, first_name, last_name, email, role, password
      FROM users
      WHERE email = ${email}
    `) as (User & { password: string })[];
    const passwordMatches = await bcrypt.compare(password, row?.password ?? DUMMY_HASH);
    if (!row || !passwordMatches) {
      res.status(401).json({ error: "Incorrect email or password" });
      return;
    }
    const { password: _password, ...user } = row;
    res.json({ token: signToken(user), user });
  } catch (error) {
    res.status(500).json({ error: "Failed to log in" });
  }
};
