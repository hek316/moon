import type { SajuResultData } from "@/lib/saju/types";
import { OHANG_HANJA } from "@/constants/saju";

export function buildFortunePrompt(saju: SajuResultData): string {
  const { pillars, ohpiAnalysis, sipsinAnalysis, strengthResult, yongsinResult, gyeokgukResult, daeunResult, seunResult, input } = saju;

  const hourInfo = pillars.hour
    ? `시주(時柱): ${pillars.hour.hanja} (${pillars.hour.hangul})`
    : "시주: 미입력";

  // 십신 배치
  const sipsinInfo = sipsinAnalysis ? `
## 십신 배치 (일간 ${pillars.day.cheongan} 기준)
- 년간: ${pillars.year.cheongan}(${sipsinAnalysis.yearCheongan})
- 월간: ${pillars.month.cheongan}(${sipsinAnalysis.monthCheongan})
- 일간: ${pillars.day.cheongan}(본인)
${pillars.hour ? `- 시간: ${pillars.hour.cheongan}(${sipsinAnalysis.hourCheongan})` : ""}

### 십신 분포
- 비겁: ${sipsinAnalysis.distribution.비겁}개 / 식상: ${sipsinAnalysis.distribution.식상}개 / 재성: ${sipsinAnalysis.distribution.재성}개 / 관성: ${sipsinAnalysis.distribution.관성}개 / 인성: ${sipsinAnalysis.distribution.인성}개` : "";

  // 신강/신약
  const strengthInfo = strengthResult
    ? `\n## 신강/신약 판정\n${strengthResult.description}`
    : "";

  // 용신
  const yongsinInfo = yongsinResult
    ? `\n## 용신/희신\n- 용신: ${yongsinResult.yongsin}(${OHANG_HANJA[yongsinResult.yongsin] ?? ""})\n- 희신: ${yongsinResult.huisin}(${OHANG_HANJA[yongsinResult.huisin] ?? ""})\n- 기신: ${yongsinResult.gisin}(${OHANG_HANJA[yongsinResult.gisin] ?? ""})`
    : "";

  // 격국
  const gyeokgukInfo = gyeokgukResult
    ? `\n## 격국\n${gyeokgukResult.name}: ${gyeokgukResult.description}`
    : "";

  // 대운
  const daeunInfo = daeunResult
    ? `\n## 대운 (${daeunResult.direction})
- 대운 흐름: ${daeunResult.pillars.slice(0, 8).map((p) => `${p.hangul}(${p.startAge}~${p.endAge}세)`).join(" → ")}
${daeunResult.currentDaeun ? `- 현재 대운: ${daeunResult.currentDaeun.hangul} (${daeunResult.currentDaeun.startAge}~${daeunResult.currentDaeun.endAge}세, 현재 ${daeunResult.currentAge}세)` : ""}`
    : "";

  // 세운
  const seunInfo = seunResult
    ? `\n## 2026년 세운 (병오년 丙午年)
- ${seunResult.hangul}년 (십신: ${seunResult.sipsin}, 12운성: ${seunResult.unsung})
- 병(丙)은 화(火) 양, 오(午)는 화(火) → 화기가 매우 강한 해`
    : "";

  // 오행 분석
  const ohangInfo = Object.entries(ohpiAnalysis.counts)
    .map(([oh, count]) => `- ${oh}(${OHANG_HANJA[oh]}): ${count}개 (${ohpiAnalysis.percentages[oh]}%)`)
    .join("\n");

  return `당신은 한국 전통 사주팔자(명리학) 전문가이자 2026년 병오년(丙午年) 운세 전문가입니다.
아래 사주 데이터를 기반으로 2026년 한 해 운세를 상세하게 해석해 주세요.
재미와 통찰을 위한 것이니 부담 없이 풍부하게 해석해 주세요.

## 사주 정보
- 생년월일시: ${input.year}년 ${input.month}월 ${input.day}일 ${input.hour}시${input.gender ? ` (${input.gender === "male" ? "남" : "여"})` : ""}
- 년주(年柱): ${pillars.year.hanja} (${pillars.year.hangul})
- 월주(月柱): ${pillars.month.hanja} (${pillars.month.hangul})
- 일주(日柱): ${pillars.day.hanja} (${pillars.day.hangul})
- ${hourInfo}

## 오행 분석
${ohangInfo}
- 가장 강한 오행: ${ohpiAnalysis.dominant}
- 가장 약한 오행: ${ohpiAnalysis.weak}

## 일주 분석
일간: "${pillars.day.cheongan}" (오행: ${pillars.day.cheonganOhang})
${sipsinInfo}
${strengthInfo}
${yongsinInfo}
${gyeokgukInfo}
${daeunInfo}
${seunInfo}

---

위 분석 데이터를 종합하여 2026년 병오년 운세를 아래 JSON 형식으로만 응답해 주세요.
각 항목은 3~5문장으로 풍부하게 작성하되, 긍정적인 내용 위주로, 부정적인 내용은 건설적 조언 형태로 작성해 주세요.
월별 운세는 1~12월 모두 작성하며, 각 월은 1~2문장으로 핵심만 작성해 주세요.
세운(병오)과 사주의 관계, 용신과의 조화를 중심으로 해석해 주세요.

{
  "yearSummary": "2026년 병오년 연간 총운 요약 (3~4문장, 세운과 사주 관계 중심)",
  "wealth": "재물운 (3~4문장, 용신/재성 기반)",
  "love": "연애운/대인관계운 (3~4문장, 일지/관성/식상 기반)",
  "health": "건강운 (2~3문장, 오행 균형 기반)",
  "career": "직장운/사업운 (3~4문장, 관성/식상/격국 기반)",
  "monthlyFortunes": [
    { "month": 1, "summary": "1월 운세 (1~2문장)", "lucky": "행운 키워드" },
    { "month": 2, "summary": "2월 운세", "lucky": "행운 키워드" },
    { "month": 3, "summary": "3월 운세", "lucky": "행운 키워드" },
    { "month": 4, "summary": "4월 운세", "lucky": "행운 키워드" },
    { "month": 5, "summary": "5월 운세", "lucky": "행운 키워드" },
    { "month": 6, "summary": "6월 운세", "lucky": "행운 키워드" },
    { "month": 7, "summary": "7월 운세", "lucky": "행운 키워드" },
    { "month": 8, "summary": "8월 운세", "lucky": "행운 키워드" },
    { "month": 9, "summary": "9월 운세", "lucky": "행운 키워드" },
    { "month": 10, "summary": "10월 운세", "lucky": "행운 키워드" },
    { "month": 11, "summary": "11월 운세", "lucky": "행운 키워드" },
    { "month": 12, "summary": "12월 운세", "lucky": "행운 키워드" }
  ],
  "luckyElements": "행운의 색, 방위, 숫자, 요일 등 (용신 오행 기반)",
  "advice": "2026년 종합 조언 (3~4문장)"
}`;
}
