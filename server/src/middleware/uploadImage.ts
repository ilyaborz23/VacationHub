import type { NextFunction, Request, Response } from "express";
import multer from "multer";

const MAX_IMAGE_SIZE_MB = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE_MB * 1024 * 1024, files: 1 },
}).single("image");

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: `Image cannot be larger than ${MAX_IMAGE_SIZE_MB} MB` });
      return;
    }
    if (error) {
      res.status(400).json({ error: "Invalid image upload" });
      return;
    }
    next();
  });
};
