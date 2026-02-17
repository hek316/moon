import { NextResponse } from "next/server";
import { calculateSajuResult } from "@/lib/saju/calculator";
import { generateText } from "@/lib/gemini/client";
import { buildSajuPrompt } from "@/lib/gemini/prompts";
import type { SajuInput, SajuInterpretation } from "@/lib/saju/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SajuInput;

    // 입력 검증
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
    let interpretation: SajuInterpretation | null = null;
    try {
      const prompt = buildSajuPrompt(sajuResult);
      const cacheKey = `saju-${body.year}-${body.month}-${body.day}-${body.hour}`;
      const raw = await generateText(prompt, cacheKey);

      // JSON 파싱 (코드 블록 제거)
      const jsonStr = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      interpretation = JSON.parse(jsonStr) as SajuInterpretation;
    } catch {
      // AI 해석 실패 시 기본 메시지
      interpretation = {
        summary: "사주팔자가 계산되었습니다.",
        personality: "AI 해석을 일시적으로 이용할 수 없습니다. 사주팔자 정보를 참고해 주세요.",
        career: "",
        relationship: "",
        advice: "",
        luckyElements: "",
      };
    }

    return NextResponse.json({
      saju: sajuResult,
      interpretation,
    });
  } catch (error) {
    console.error("사주 계산 오류:", error);
    return NextResponse.json(
      { error: "사주 계산 중 오류가 발생했습니다. 입력값을 확인해주세요." },
      { status: 500 }
    );
  }
}
