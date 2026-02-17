import { NextResponse } from "next/server";
import { calculateSajuResult } from "@/lib/saju/calculator";
import { analyzeCompatibility } from "@/lib/saju/analysis";
import { generateText } from "@/lib/gemini/client";
import { buildCompatibilityPrompt } from "@/lib/gemini/prompts";
import { logError, categorizeError, getClientErrorMessage } from "@/lib/logger";
import type { CompatibilityInput, CompatibilityInterpretation } from "@/lib/saju/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompatibilityInput;

    if (!body.person1 || !body.person2) {
      return NextResponse.json({ error: "두 사람의 정보를 입력해주세요." }, { status: 400 });
    }

    // 두 사람 사주 계산
    const saju1 = calculateSajuResult(body.person1);
    const saju2 = calculateSajuResult(body.person2);

    // 궁합 분석
    const compatResult = {
      person1: saju1,
      person2: saju2,
      ...analyzeCompatibility(saju1, saju2),
    };

    // Gemini AI 해석
    let interpretation: CompatibilityInterpretation | null = null;
    let errorHint: string | undefined;
    try {
      const prompt = buildCompatibilityPrompt(compatResult);
      const cacheKey = `compat-${body.person1.year}${body.person1.month}${body.person1.day}-${body.person2.year}${body.person2.month}${body.person2.day}`;
      const raw = await generateText(prompt, cacheKey);

      const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      try {
        interpretation = JSON.parse(jsonStr) as CompatibilityInterpretation;
      } catch (parseError) {
        logError(parseError, { api: "compatibility", category: "PARSE", input: { year: body.person1.year }, raw: jsonStr });
        errorHint = getClientErrorMessage("PARSE");
      }
    } catch (aiError) {
      const { category, statusCode } = categorizeError(aiError);
      logError(aiError, { api: "compatibility", category, statusCode, input: { year: body.person1.year } });
      errorHint = getClientErrorMessage(category);
    }

    if (!interpretation) {
      interpretation = {
        summary: "궁합 분석이 완료되었습니다.",
        strengths: errorHint ?? "AI 해석을 일시적으로 이용할 수 없습니다.",
        challenges: "",
        advice: "",
      };
    }

    return NextResponse.json({
      compatibility: compatResult,
      interpretation,
    });
  } catch (error) {
    const { category, statusCode } = categorizeError(error);
    logError(error, { api: "compatibility", category, statusCode });
    return NextResponse.json(
      { error: "궁합 계산 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
