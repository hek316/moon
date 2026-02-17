import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
}

// 간단한 인메모리 캐시
const cache = new Map<string, { data: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30분

export async function generateText(prompt: string, cacheKey?: string): Promise<string> {
  // 캐시 확인
  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  const genAI = getAI();
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

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
