import type { NextFunction, Request, Response } from "express";
import { asTrimmed } from "./validateRegister";

const MAX_QUESTION_LENGTH = 500;

export const validateQuestion = (req: Request, res: Response, next: NextFunction) => {
  const question = asTrimmed(req.body?.question);

  if (!question) {
    res.status(400).json({ error: "Question is required" });
    return;
  }
  if (question.length > MAX_QUESTION_LENGTH) {
    res.status(400).json({ error: `Question cannot be longer than ${MAX_QUESTION_LENGTH} characters` });
    return;
  }

  req.body = { question };
  next();
};
