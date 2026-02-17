import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    if (!apiKey) {
      console.error("Error: GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
      throw new Error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// 간단한 인메모리 캐시
const cache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30분

export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "GeminiError";
  }
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("rate limit") ||
          error.message.includes("quota"));

      if (!isRateLimit || attempt === maxRetries) throw error;

      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unreachable");
}

export async function generateText(prompt: string, cacheKey?: string): Promise<string> {
  // 캐시 확인
  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  const genAI = getAI();
  const response = await withRetry(() =>
    genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    })
  );

  const text = response.text ?? "";
  if (!text) {
    throw new GeminiError("Gemini API returned empty response");
  }

  // 캐시 저장
  if (cacheKey) {
    cache.set(cacheKey, { data: text, timestamp: Date.now() });
    // 오래된 캐시 정리 (100개 초과 시)
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }
  }

  return text;
}
