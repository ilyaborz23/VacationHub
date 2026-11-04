import type { Request, Response } from "express";
import { sql } from "../db/connect";
import type { Vacation } from "../types/Vacation";

const PAGE_SIZE = 9;
const MAX_INTEGER = 2147483647;
const FILTERS = ["all", "liked", "active", "upcoming"] as const;
type VacationFilter = (typeof FILTERS)[number];

const parsePositiveInteger = (value: unknown) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number <= MAX_INTEGER ? number : null;
};

const vacationColumns = (userId: number) => sql`
  v.vacation_id, v.destination, v.description, v.start_date::text AS start_date,
  v.end_date::text AS end_date, v.price::float8 AS price, v.image_file_name,
  (SELECT COUNT(*)::int FROM likes l WHERE l.vacation_id = v.vacation_id) AS likes_count,
  EXISTS (SELECT 1 FROM likes l WHERE l.vacation_id = v.vacation_id AND l.user_id = ${userId}) AS is_liked
`;

const filterCondition = (filter: VacationFilter, userId: number) => {
  const today = sql`(now() AT TIME ZONE 'Asia/Jerusalem')::date`;
  switch (filter) {
    case "liked":
      return sql`EXISTS (SELECT 1 FROM likes l WHERE l.vacation_id = v.vacation_id AND l.user_id = ${userId})`;
    case "active":
      return sql`v.start_date <= ${today} AND v.end_date >= ${today}`;
    case "upcoming":
      return sql`v.start_date > ${today}`;
    default:
      return sql`TRUE`;
  }
};

const findVacation = async (id: number, userId: number) => {
  const [vacation] = (await sql`
    SELECT ${vacationColumns(userId)}
    FROM vacations v
    WHERE v.vacation_id = ${id}
  `) as Vacation[];
  return vacation;
};

//getVacations
export const getVacations = async (req: Request, res: Response) => {
  const { userId } = res.locals.user;
  const page = parsePositiveInteger(req.query.page ?? 1);
  const filter = (req.query.filter ?? "all") as VacationFilter;
  if (page === null) {
    res.status(400).json({ error: "Invalid page" });
    return;
  }
  if (!FILTERS.includes(filter)) {
    res.status(400).json({ error: "Invalid filter" });
    return;
  }
  try {
    const [rows, counts] = await Promise.all([
      sql`
        SELECT ${vacationColumns(userId)}
        FROM vacations v
        WHERE ${filterCondition(filter, userId)}
        ORDER BY v.start_date, v.vacation_id
        LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}
      `,
      sql`
        SELECT COUNT(*)::int AS count
        FROM vacations v
        WHERE ${filterCondition(filter, userId)}
      `,
    ]);
    const vacations = rows as Vacation[];
    const totalCount = (counts[0]?.count as number) ?? 0;
    res.json({ vacations, page, totalPages: Math.ceil(totalCount / PAGE_SIZE), totalCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vacations" });
  }
};

//getVacationById
export const getVacationById = async (req: Request, res: Response) => {
  const id = parsePositiveInteger(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid vacation id" });
    return;
  }
  try {
    const vacation = await findVacation(id, res.locals.user.userId);
    if (!vacation) {
      res.status(404).json({ error: "Vacation not found" });
    } else {
      res.json(vacation);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vacation" });
  }
};

//likeVacation
export const likeVacation = async (req: Request, res: Response) => {
  const { userId } = res.locals.user;
  const id = parsePositiveInteger(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid vacation id" });
    return;
  }
  try {
    await sql`
      INSERT INTO likes (user_id, vacation_id)
      SELECT ${userId}, vacation_id FROM vacations WHERE vacation_id = ${id}
      ON CONFLICT DO NOTHING
    `;
    const vacation = await findVacation(id, userId);
    if (!vacation) {
      res.status(404).json({ error: "Vacation not found" });
    } else {
      res.json(vacation);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to like vacation" });
  }
};

//unlikeVacation
export const unlikeVacation = async (req: Request, res: Response) => {
  const { userId } = res.locals.user;
  const id = parsePositiveInteger(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid vacation id" });
    return;
  }
  try {
    await sql`DELETE FROM likes WHERE user_id = ${userId} AND vacation_id = ${id}`;
    const vacation = await findVacation(id, userId);
    if (!vacation) {
      res.status(404).json({ error: "Vacation not found" });
    } else {
      res.json(vacation);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to unlike vacation" });
  }
};
