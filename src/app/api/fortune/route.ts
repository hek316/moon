import { NextResponse } from "next/server";
import { calculateSajuResult } from "@/lib/saju/calculator";
import { generateText } from "@/lib/gemini/client";
import { buildFortunePrompt } from "@/lib/gemini/fortune-prompt";
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
    try {
      const prompt = buildFortunePrompt(sajuResult);
      const cacheKey = `fortune-2026-${body.year}-${body.month}-${body.day}-${body.hour}-${body.gender ?? ""}`;
      const raw = await generateText(prompt, cacheKey);

      const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      interpretation = JSON.parse(jsonStr) as FortuneInterpretation;
    } catch (aiError) {
      console.error("Gemini AI 운세 해석 오류:", aiError);
      interpretation = {
        yearSummary: "2026년 운세가 계산되었습니다.",
        wealth: "AI 해석을 일시적으로 이용할 수 없습니다.",
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
    console.error("운세 계산 오류:", error);
    return NextResponse.json(
      { error: "운세 계산 중 오류가 발생했습니다. 입력값을 확인해주세요." },
      { status: 500 }
    );
  }
}
