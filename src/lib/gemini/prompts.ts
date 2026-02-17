import type { SajuResultData, CompatibilityResultData } from "@/lib/saju/types";
import { OHANG_HANJA } from "@/constants/saju";

export function buildSajuPrompt(saju: SajuResultData): string {
  const { pillars, ohpiAnalysis, sipsinAnalysis, strengthResult, yongsinResult, gyeokgukResult, daeunResult, seunResult, input } = saju;
  const hourInfo = pillars.hour
    ? `시주(時柱): ${pillars.hour.hanja} (${pillars.hour.hangul})`
    : "시주: 미입력";

  // 십신 배치 정보
  const sipsinInfo = sipsinAnalysis ? `
## 십신 배치 (일간 ${pillars.day.cheongan} 기준)
- 년간: ${pillars.year.cheongan}(${sipsinAnalysis.yearCheongan})
- 월간: ${pillars.month.cheongan}(${sipsinAnalysis.monthCheongan})
- 일간: ${pillars.day.cheongan}(본인)
${pillars.hour ? `- 시간: ${pillars.hour.cheongan}(${sipsinAnalysis.hourCheongan})` : ""}

### 지장간 십신
- 년지 ${pillars.year.jiji}: ${pillars.year.jijanggan?.join(",")} → ${sipsinAnalysis.yearJijanggan.join(",")}
- 월지 ${pillars.month.jiji}: ${pillars.month.jijanggan?.join(",")} → ${sipsinAnalysis.monthJijanggan.join(",")}
- 일지 ${pillars.day.jiji}: ${pillars.day.jijanggan?.join(",")} → ${sipsinAnalysis.dayJijanggan.join(",")}
${pillars.hour ? `- 시지 ${pillars.hour.jiji}: ${pillars.hour.jijanggan?.join(",")} → ${sipsinAnalysis.hourJijanggan?.join(",") ?? ""}` : ""}

### 십신 분포
- 비겁: ${sipsinAnalysis.distribution.비겁}개 / 식상: ${sipsinAnalysis.distribution.식상}개 / 재성: ${sipsinAnalysis.distribution.재성}개 / 관성: ${sipsinAnalysis.distribution.관성}개 / 인성: ${sipsinAnalysis.distribution.인성}개` : "";

  // 12운성 정보
  const unsungInfo = `
## 12운성 (일간 기준)
- 년지 ${pillars.year.jiji}: ${pillars.year.unsung ?? "?"}
- 월지 ${pillars.month.jiji}: ${pillars.month.unsung ?? "?"}
- 일지 ${pillars.day.jiji}: ${pillars.day.unsung ?? "?"}
${pillars.hour ? `- 시지 ${pillars.hour.jiji}: ${pillars.hour.unsung ?? "?"}` : ""}`;

  // 신강/신약 정보
  const strengthInfo = strengthResult
    ? `\n## 신강/신약 판정\n${strengthResult.description}`
    : "";

  // 용신 정보
  const yongsinInfo = yongsinResult
    ? `\n## 용신/희신\n- 용신: ${yongsinResult.yongsin}(${OHANG_HANJA[yongsinResult.yongsin] ?? ""})\n- 희신: ${yongsinResult.huisin}(${OHANG_HANJA[yongsinResult.huisin] ?? ""})\n- 기신: ${yongsinResult.gisin}(${OHANG_HANJA[yongsinResult.gisin] ?? ""})\n- ${yongsinResult.description}`
    : "";

  // 격국 정보
  const gyeokgukInfo = gyeokgukResult
    ? `\n## 격국\n${gyeokgukResult.name}: ${gyeokgukResult.description}`
    : "";

  // 대운 정보
  const daeunInfo = daeunResult
    ? `\n## 대운 (${daeunResult.direction})
- 대운 흐름: ${daeunResult.pillars.slice(0, 8).map((p) => `${p.hangul}(${p.startAge}~${p.endAge}세)`).join(" → ")}
${daeunResult.currentDaeun ? `- 현재 대운: ${daeunResult.currentDaeun.hangul} (${daeunResult.currentDaeun.startAge}~${daeunResult.currentDaeun.endAge}세, 현재 ${daeunResult.currentAge}세)` : ""}`
    : "";

  // 세운 정보
  const seunInfo = seunResult
    ? `\n## ${seunResult.year}년 세운\n- ${seunResult.hangul}년 (십신: ${seunResult.sipsin}, 12운성: ${seunResult.unsung})`
    : "";

  return `당신은 한국 전통 사주팔자(명리학) 전문가입니다. 아래 명리학적 분석 데이터를 기반으로 따뜻하고 풍부하게 해석해 주세요.
재미와 통찰을 위한 것이니 부담 없이 풍부하게 해석해 주세요. 십신, 용신, 격국 등 전문 용어는 쉬운 말로 풀어서 설명해 주세요.

## 사주 정보
- 생년월일시: ${input.year}년 ${input.month}월 ${input.day}일 ${input.hour}시${input.gender ? ` (${input.gender === "male" ? "남" : "여"})` : ""}
- 년주(年柱): ${pillars.year.hanja} (${pillars.year.hangul})
- 월주(月柱): ${pillars.month.hanja} (${pillars.month.hangul})
- 일주(日柱): ${pillars.day.hanja} (${pillars.day.hangul})
- ${hourInfo}

## 오행 분석
${Object.entries(ohpiAnalysis.counts)
  .map(([oh, count]) => `- ${oh}(${OHANG_HANJA[oh]}): ${count}개 (${ohpiAnalysis.percentages[oh]}%)`)
  .join("\n")}
- 가장 강한 오행: ${ohpiAnalysis.dominant}
- 가장 약한 오행: ${ohpiAnalysis.weak}

## 일주(일간) 분석
일간(일주의 천간)은 "${pillars.day.cheongan}"으로 오행은 "${pillars.day.cheonganOhang}"입니다.
${sipsinInfo}
${unsungInfo}
${strengthInfo}
${yongsinInfo}
${gyeokgukInfo}
${daeunInfo}
${seunInfo}

---

위 분석 데이터를 종합하여 아래 JSON 형식으로만 응답해 주세요.
각 항목은 2~4문장으로 풍부하게 작성하되, 긍정적인 내용 위주로, 부정적인 내용은 건설적 조언 형태로 작성해 주세요.
특히 용신/격국 기반으로 성격과 직업 적성을 해석하고, 대운/세운 기반으로 올해 운세를 구체적으로 조언해 주세요.

{
  "summary": "한 줄 요약 (격국과 일간 특성 반영)",
  "personality": "성격과 기질 분석 (십신 배치와 격국 기반)",
  "career": "직업/적성 분석 (용신과 격국 기반)",
  "relationship": "대인관계/연애 성향 (일지와 십신 관계 기반)",
  "advice": "올해(${seunResult?.year ?? new Date().getFullYear()}년) 운세와 조언 (세운/대운 기반)",
  "luckyElements": "행운의 색, 방위, 숫자 등 (용신 오행 기반)"
}`;
}

export function buildCompatibilityPrompt(result: CompatibilityResultData): string {
  const { person1, person2, score, cheonganHap, jijiHap, jijiChung, jijiHyung, jijiPa, jijiHae, ilganRelation, iljiRelation, ohangBalance } = result;

  // 각 사람의 십신/용신 정보 요약
  const p1Summary = buildPersonSummary(person1, "첫 번째");
  const p2Summary = buildPersonSummary(person2, "두 번째");

  return `당신은 한국 전통 사주 궁합(명리학) 전문가입니다. 따뜻하고 재미있는 톤으로 해석해 주세요.

${p1Summary}

${p2Summary}

## 궁합 핵심 분석
### 일간(日干) 관계 (가장 중요)
${ilganRelation}

### 일지(日支) 관계
${iljiRelation}

## 궁합 세부 분석
- 궁합 점수: ${score}점
- 천간합: ${cheonganHap.length > 0 ? cheonganHap.join(", ") : "없음"}
- 지지합: ${jijiHap.length > 0 ? jijiHap.join(", ") : "없음"}
- 지지충: ${jijiChung.length > 0 ? jijiChung.join(", ") : "없음"}
- 지지형: ${jijiHyung.length > 0 ? jijiHyung.join(", ") : "없음"}
- 지지파: ${jijiPa.length > 0 ? jijiPa.join(", ") : "없음"}
- 지지해: ${jijiHae.length > 0 ? jijiHae.join(", ") : "없음"}
- 오행 보완: ${ohangBalance}

---

아래 JSON 형식으로만 응답해 주세요. 일간/일지 관계를 가장 중요하게 다루고, 부정적인 내용도 건설적이고 따뜻한 조언 형태로 작성해 주세요.

{
  "summary": "궁합 한 줄 요약 (일간 관계 중심)",
  "strengths": "두 사람의 궁합에서 좋은 점 (2~3문장, 합과 상생 중심)",
  "challenges": "주의할 점 또는 보완할 점 (2~3문장, 충/형 관계 건설적 해석)",
  "advice": "두 사람에게 드리는 조언 (2~3문장, 오행 보완 방법 포함)"
}`;
}

function buildPersonSummary(person: SajuResultData, label: string): string {
  const { pillars, strengthResult, yongsinResult, gyeokgukResult } = person;
  let summary = `## ${label} 사람
- 사주: ${pillars.year.hangul} ${pillars.month.hangul} ${pillars.day.hangul} ${pillars.hour?.hangul ?? "미입력"}
- 일간: ${pillars.day.cheongan}(${pillars.day.cheonganOhang})`;

  if (strengthResult) {
    summary += `\n- ${strengthResult.level} (점수 ${strengthResult.score})`;
  }
  if (yongsinResult) {
    summary += `\n- 용신: ${yongsinResult.yongsin}, 희신: ${yongsinResult.huisin}`;
  }
  if (gyeokgukResult) {
    summary += `\n- 격국: ${gyeokgukResult.name}`;
  }

  return summary;
}
