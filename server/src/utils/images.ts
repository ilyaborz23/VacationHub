import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

// Resolves to server/images from both src/utils and dist/utils
export const IMAGES_DIR = path.resolve(__dirname, "../../images");

const startsWith = (buffer: Buffer, bytes: number[], offset = 0) =>
  bytes.every((byte, index) => buffer[offset + index] === byte);

// The extension comes from the file content, because the name and type sent by the client can be anything
export const detectImageExtension = (buffer: Buffer) => {
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return ".jpg";
  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return ".png";
  if (startsWith(buffer, [0x47, 0x49, 0x46, 0x38])) return ".gif";
  if (startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) && startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)) return ".webp";
  return null;
};

export const saveImage = async (buffer: Buffer) => {
  const fileName = `${randomUUID()}${detectImageExtension(buffer)}`;
  await mkdir(IMAGES_DIR, { recursive: true });
  await writeFile(path.join(IMAGES_DIR, fileName), buffer);
  return fileName;
};

export const removeImage = async (fileName: string) => {
  try {
    await rm(path.join(IMAGES_DIR, path.basename(fileName)), { force: true });
  } catch (error) {
    console.error("Failed to remove image:", error instanceof Error ? error.message : error);
  }
};
