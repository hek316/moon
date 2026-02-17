import { NextResponse } from "next/server";
import { calculateSajuResult } from "@/lib/saju/calculator";
import { generateText } from "@/lib/gemini/client";
import { buildFortunePrompt } from "@/lib/gemini/fortune-prompt";
import { logError, categorizeError, getClientErrorMessage } from "@/lib/logger";
import type { SajuInput, FortuneInterpretation } from "@/lib/saju/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SajuInput;

    if (!body.year || !body.month || !body.day) {
      return NextResponse.json({ error: "생년월일을 입력해주세요." }, { status: 400 });
    }

    if (body.year < 1900 || body.year > 2050) {
      return NextResponse.json(
        { error: "1900년~2050년 사이의 년도만 지원합니다." },
        { status: 400 }
      );
    }

    // 사주 계산
    const sajuResult = calculateSajuResult(body);

    // Gemini AI 해석
    let interpretation: FortuneInterpretation | null = null;
    let errorHint: string | undefined;
    try {
      const prompt = buildFortunePrompt(sajuResult);
      const cacheKey = `fortune-2026-${body.year}-${body.month}-${body.day}-${body.hour}-${body.gender ?? ""}`;
      const raw = await generateText(prompt, cacheKey);

      const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      try {
        const parsed = JSON.parse(jsonStr);

        // Gemini가 문자열 대신 객체를 반환하는 경우 안전하게 변환
        const safeStr = (v: unknown): string =>
          typeof v === "string" ? v : typeof v === "object" && v !== null ? Object.values(v).join(", ") : String(v ?? "");

        interpretation = {
          yearSummary: safeStr(parsed.yearSummary),
          wealth: safeStr(parsed.wealth),
          love: safeStr(parsed.love),
          health: safeStr(parsed.health),
          career: safeStr(parsed.career),
          monthlyFortunes: Array.isArray(parsed.monthlyFortunes)
            ? parsed.monthlyFortunes.map((mf: Record<string, unknown>, i: number) => ({
                month: typeof mf.month === "number" ? mf.month : i + 1,
                summary: safeStr(mf.summary),
                lucky: safeStr(mf.lucky),
              }))
            : Array.from({ length: 12 }, (_, i) => ({ month: i + 1, summary: "", lucky: "" })),
          luckyElements: safeStr(parsed.luckyElements),
          advice: safeStr(parsed.advice),
        };
      } catch (parseError) {
        logError(parseError, { api: "fortune", category: "PARSE", input: { year: body.year }, raw: jsonStr });
        errorHint = getClientErrorMessage("PARSE");
      }
    } catch (aiError) {
      const { category, statusCode } = categorizeError(aiError);
      logError(aiError, { api: "fortune", category, statusCode, input: { year: body.year } });
      errorHint = getClientErrorMessage(category);
    }

    if (!interpretation) {
      interpretation = {
        yearSummary: "2026년 운세가 계산되었습니다.",
        wealth: errorHint ?? "AI 해석을 일시적으로 이용할 수 없습니다.",
        love: "",
        health: "",
        career: "",
        monthlyFortunes: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          summary: "",
          lucky: "",
        })),
        luckyElements: "",
        advice: "",
      };
    }

    return NextResponse.json({
      saju: sajuResult,
      interpretation,
    });
  } catch (error) {
    const { category, statusCode } = categorizeError(error);
    logError(error, { api: "fortune", category, statusCode });
    return NextResponse.json(
      { error: "운세 계산 중 오류가 발생했습니다. 입력값을 확인해주세요." },
      { status: 500 }
    );
  }
}
