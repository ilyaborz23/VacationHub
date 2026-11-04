import type { NextFunction, Request, Response } from "express";
import { todayInIsrael } from "../utils/date";
import { detectImageExtension } from "../utils/images";
import { asTrimmed } from "./validateRegister";

const MAX_DESTINATION_LENGTH = 100;
const MAX_PRICE = 10000;
const PRICE_PATTERN = /^-?\d+(\.\d{1,2})?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isRealDate = (value: string) => {
  const date = new Date(`${value}T00:00:00Z`);
  return DATE_PATTERN.test(value) && !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
};

type ValidationOptions = {
  imageRequired: boolean;
  allowPastDates: boolean;
};

const validateVacation = ({ imageRequired, allowPastDates }: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const body = req.body ?? {};
    const destination = asTrimmed(body.destination);
    const description = asTrimmed(body.description);
    const startDate = asTrimmed(body.start_date);
    const endDate = asTrimmed(body.end_date);
    const price = asTrimmed(body.price);

    if (!destination || !description || !startDate || !endDate || !price || (imageRequired && !req.file)) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }
    if (destination.length > MAX_DESTINATION_LENGTH) {
      res.status(400).json({ error: `Destination cannot be longer than ${MAX_DESTINATION_LENGTH} characters` });
      return;
    }
    if (!isRealDate(startDate) || !isRealDate(endDate)) {
      res.status(400).json({ error: "Invalid date" });
      return;
    }
    if (endDate < startDate) {
      res.status(400).json({ error: "End date cannot be earlier than start date" });
      return;
    }
    if (!allowPastDates && startDate < todayInIsrael()) {
      res.status(400).json({ error: "Dates cannot be in the past" });
      return;
    }
    if (!PRICE_PATTERN.test(price)) {
      res.status(400).json({ error: "Invalid price" });
      return;
    }
    if (Number(price) < 0 || Number(price) > MAX_PRICE) {
      res.status(400).json({ error: `Price must be between 0 and ${MAX_PRICE}` });
      return;
    }
    if (req.file && !detectImageExtension(req.file.buffer)) {
      res.status(400).json({ error: "Image must be a JPG, PNG, GIF or WEBP file" });
      return;
    }

    req.body = { destination, description, start_date: startDate, end_date: endDate, price: Number(price) };
    next();
  };
};

export const validateNewVacation = validateVacation({ imageRequired: true, allowPastDates: false });
export const validateVacationUpdate = validateVacation({ imageRequired: false, allowPastDates: true });
