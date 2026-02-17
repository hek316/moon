import { CHEONGAN_OHANG, JIJANGGAN } from "@/constants/saju";
import type { Pillar, StrengthResult } from "./types";
import { calculateSipsin, getSipsinGroup } from "./sipsin";

// 일간의 세력을 돕는 십신 그룹
const HELPING_GROUPS = new Set(["비겁", "인성"]);

// 득령 판단: 월지 본기가 일간을 돕는가
function checkDeukryeong(ilgan: string, monthJiji: string): boolean {
  const bongi = JIJANGGAN[monthJiji]?.[0];
  if (!bongi) return false;
  const sipsin = calculateSipsin(ilgan, bongi);
  return HELPING_GROUPS.has(getSipsinGroup(sipsin));
}

// 득지 판단: 4지지의 지장간 중 일간을 돕는 것이 있는가
function checkDeukji(ilgan: string, pillars: {
  year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null;
}): { result: boolean; count: number } {
  let helpCount = 0;
  const allJiji = [
    pillars.year.jiji, pillars.month.jiji,
    pillars.day.jiji, ...(pillars.hour ? [pillars.hour.jiji] : []),
  ];

  for (const jiji of allJiji) {
    const jjg = JIJANGGAN[jiji] ?? [];
    for (const gan of jjg) {
      if (CHEONGAN_OHANG[gan] === CHEONGAN_OHANG[ilgan]) {
        helpCount++;
        break; // 지지당 하나만 카운트
      }
    }
  }

  return { result: helpCount >= 2, count: helpCount };
}

// 득세 판단: 천간에 비겁/인성이 있는가
function checkDeukse(ilgan: string, pillars: {
  year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null;
}): { result: boolean; count: number } {
  let helpCount = 0;
  const cheongans = [
    pillars.year.cheongan, pillars.month.cheongan,
    ...(pillars.hour ? [pillars.hour.cheongan] : []),
  ];

  for (const gan of cheongans) {
    const sipsin = calculateSipsin(ilgan, gan);
    if (HELPING_GROUPS.has(getSipsinGroup(sipsin))) {
      helpCount++;
    }
  }

  return { result: helpCount >= 1, count: helpCount };
}

// 신강/신약 종합 판단
export function analyzeStrength(pillars: {
  year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null;
}): StrengthResult {
  const ilgan = pillars.day.cheongan;

  const deukryeong = checkDeukryeong(ilgan, pillars.month.jiji);
  const deukji = checkDeukji(ilgan, pillars);
  const deukse = checkDeukse(ilgan, pillars);

  // 점수 계산 (-10 ~ +10)
  let score = 0;
  if (deukryeong) score += 4;  // 득령이 가장 중요
  else score -= 3;

  score += (deukji.count - 1.5) * 2; // 2개 이상이면 +, 1개 이하면 -
  score += (deukse.count - 0.5) * 2; // 1개 이상이면 +

  score = Math.max(-10, Math.min(10, Math.round(score)));

  let level: "신강" | "신약" | "중화";
  if (score >= 3) level = "신강";
  else if (score <= -3) level = "신약";
  else level = "중화";

  const reasons: string[] = [];
  reasons.push(deukryeong
    ? `득령(월지 ${pillars.month.jiji}에서 힘을 얻음)`
    : `실령(월지 ${pillars.month.jiji}에서 힘을 못 얻음)`);
  reasons.push(deukji.result
    ? `득지(지지에 뿌리 ${deukji.count}개)`
    : `실지(지지에 뿌리 ${deukji.count}개)`);
  reasons.push(deukse.result
    ? `득세(천간 도움 ${deukse.count}개)`
    : `실세(천간 도움 ${deukse.count}개)`);

  return {
    score,
    level,
    deukryeong,
    deukji: deukji.result,
    deukse: deukse.result,
    description: `${level}(점수 ${score}): ${reasons.join(", ")}`,
  };
}
