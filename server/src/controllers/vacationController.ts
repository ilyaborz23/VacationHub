import type { Request, Response } from "express";
import { sql } from "../db/connect";
import type { Vacation } from "../types/Vacation";

//getVacations
export const getVacations = async (req: Request, res: Response) => {
  try {
    const vacations = (await sql`
      SELECT vacation_id, destination, description, start_date::text AS start_date,
        end_date::text AS end_date, price::float8 AS price, image_file_name
      FROM vacations
      ORDER BY start_date
    `) as Vacation[];
    res.json(vacations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vacations" });
  }
};

//getVacationById
export const getVacationById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    res.status(400).json({ error: "Invalid vacation id" });
    return;
  }
  try {
    const vacations = (await sql`
      SELECT vacation_id, destination, description, start_date::text AS start_date,
        end_date::text AS end_date, price::float8 AS price, image_file_name
      FROM vacations
      WHERE vacation_id = ${id}
    `) as Vacation[];
    if (vacations.length === 0) {
      res.status(404).json({ error: "Vacation not found" });
    } else {
      res.json(vacations[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vacation" });
  }
};
