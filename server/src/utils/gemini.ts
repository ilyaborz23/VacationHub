import "dotenv/config";
import { ApiError, GoogleGenAI } from "@google/genai";
import type { GenerateContentConfig } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in .env");
}

const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];
const REQUEST_TIMEOUT_MS = 30000;

const isTemporaryFailure = (error: unknown) =>
  error instanceof ApiError && (error.status === 429 || error.status >= 500);

const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: REQUEST_TIMEOUT_MS } });

export const generateText = async (contents: string, config: GenerateContentConfig) => {
  for (const [index, model] of MODELS.entries()) {
    try {
      const response = await ai.models.generateContent({ model, contents, config });
      return response.text?.trim();
    } catch (error) {
      if (!isTemporaryFailure(error) || index === MODELS.length - 1) {
        throw error;
      }
      console.warn(`Gemini model ${model} is unavailable, trying the next one`);
    }
  }
};
