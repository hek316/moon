import type { Pillar, OhangAnalysis, SajuResultData, CompatibilityResultData } from "./types";
import {
  CHEONGAN_HAP, CHEONGAN_OHANG,
  JIJI_YUKHAP, JIJI_SAMHAP, JIJI_CHUNG,
  JIJI_HYUNG, JIJI_PA, JIJI_HAE,
  JIJANGGAN, OHANG_SANGSAENG, OHANG_SANGGEUK,
} from "@/constants/saju";
import { calculateSipsin, getSipsinGroup } from "./sipsin";

const OHANG_LIST = ["목", "화", "토", "금", "수"];

// 사주 네 기둥에서 오행 분석 (지장간 포함)
export function analyzeOhang(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}): OhangAnalysis {
  const counts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  const pillarList = [pillars.year, pillars.month, pillars.day, pillars.hour].filter(
    (p): p is Pillar => p !== null
  );

  for (const p of pillarList) {
    if (counts[p.cheonganOhang] !== undefined) counts[p.cheonganOhang]++;
    if (counts[p.jijiOhang] !== undefined) counts[p.jijiOhang]++;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const percentages: Record<string, number> = {};
  for (const key of OHANG_LIST) {
    percentages[key] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  const dominant = OHANG_LIST.reduce((a, b) => (counts[a] >= counts[b] ? a : b));
  const weak = OHANG_LIST.reduce((a, b) => (counts[a] <= counts[b] ? a : b));

  // 지장간 포함 오행 카운트
  const jijangganCounts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of pillarList) {
    // 천간 오행
    if (jijangganCounts[p.cheonganOhang] !== undefined) jijangganCounts[p.cheonganOhang]++;
    // 지장간 오행 (본기만)
    const jjg = JIJANGGAN[p.jiji];
    if (jjg?.[0]) {
      const bongiOhang = CHEONGAN_OHANG[jjg[0]];
      if (bongiOhang && jijangganCounts[bongiOhang] !== undefined) {
        jijangganCounts[bongiOhang]++;
      }
    }
  }
  const jijangganTotal = Object.values(jijangganCounts).reduce((a, b) => a + b, 0);

  return { counts, total, dominant, weak, percentages, jijangganCounts, jijangganTotal };
}

// 두 사람의 궁합 분석 (일간/일지 중심 재설계)
export function analyzeCompatibility(
  person1: SajuResultData,
  person2: SajuResultData
): Omit<CompatibilityResultData, "person1" | "person2"> {
  const p1Pillars = getAllPillars(person1);
  const p2Pillars = getAllPillars(person2);

  // === 일간(日干) 관계 분석 ===
  const ilgan1 = person1.pillars.day.cheongan;
  const ilgan2 = person2.pillars.day.cheongan;
  const ilganOhang1 = CHEONGAN_OHANG[ilgan1];
  const ilganOhang2 = CHEONGAN_OHANG[ilgan2];

  let ilganRelation = "";
  let ilganScore = 0;

  // 천간합 체크
  const isIlganHap = CHEONGAN_HAP.some(
    ([a, b]) => (ilgan1 === a && ilgan2 === b) || (ilgan1 === b && ilgan2 === a)
  );
  if (isIlganHap) {
    ilganRelation = `${ilgan1}-${ilgan2} 천간합 (매우 좋은 궁합)`;
    ilganScore = 20;
  } else if (ilganOhang1 === ilganOhang2) {
    ilganRelation = `같은 오행(${ilganOhang1}) - 비겁 관계 (동지적)`;
    ilganScore = 5;
  } else if (OHANG_SANGSAENG[ilganOhang1] === ilganOhang2) {
    ilganRelation = `${ilganOhang1}→${ilganOhang2} 상생 (자연스러운 흐름)`;
    ilganScore = 10;
  } else if (OHANG_SANGSAENG[ilganOhang2] === ilganOhang1) {
    ilganRelation = `${ilganOhang2}→${ilganOhang1} 상생 (돌봄 받는 관계)`;
    ilganScore = 10;
  } else if (OHANG_SANGGEUK[ilganOhang1] === ilganOhang2) {
    ilganRelation = `${ilganOhang1}→${ilganOhang2} 상극 (긴장 관계)`;
    ilganScore = -5;
  } else {
    ilganRelation = `${ilganOhang2}→${ilganOhang1} 상극 (도전 관계)`;
    ilganScore = -5;
  }

  // === 일지(日支) 관계 분석 ===
  const ilji1 = person1.pillars.day.jiji;
  const ilji2 = person2.pillars.day.jiji;
  let iljiRelation = "";
  let iljiScore = 0;

  const isIljiYukhap = JIJI_YUKHAP.some(
    ([a, b]) => (ilji1 === a && ilji2 === b) || (ilji1 === b && ilji2 === a)
  );
  const isIljiChung = JIJI_CHUNG.some(
    ([a, b]) => (ilji1 === a && ilji2 === b) || (ilji1 === b && ilji2 === a)
  );
  const isIljiHyung = JIJI_HYUNG.some(
    ([a, b]) => (ilji1 === a && ilji2 === b) || (ilji1 === b && ilji2 === a)
  );

  if (isIljiYukhap) {
    iljiRelation = `${ilji1}-${ilji2} 육합 (깊은 정서적 유대)`;
    iljiScore = 15;
  } else if (isIljiChung) {
    iljiRelation = `${ilji1}-${ilji2} 충 (갈등과 긴장)`;
    iljiScore = -10;
  } else if (isIljiHyung) {
    iljiRelation = `${ilji1}-${ilji2} 형 (시련과 성장)`;
    iljiScore = -5;
  } else {
    iljiRelation = `${ilji1}-${ilji2} 평 (무난한 관계)`;
    iljiScore = 3;
  }

  // === 전체 기둥 합/충/형/파/해 체크 ===
  const cheonganHap: string[] = [];
  for (const [a, b] of CHEONGAN_HAP) {
    const p1Has = p1Pillars.some((p) => p.cheongan === a || p.cheongan === b);
    const p2Has = p2Pillars.some((p) => p.cheongan === a || p.cheongan === b);
    if (p1Has && p2Has) {
      const p1Match = p1Pillars.find((p) => p.cheongan === a || p.cheongan === b);
      const p2Match = p2Pillars.find((p) => p.cheongan === a || p.cheongan === b);
      if (p1Match && p2Match && p1Match.cheongan !== p2Match.cheongan) {
        cheonganHap.push(`${a}-${b} 합`);
      }
    }
  }

  const jijiHap: string[] = [];
  for (const [a, b] of JIJI_YUKHAP) {
    const p1Has = p1Pillars.some((p) => p.jiji === a || p.jiji === b);
    const p2Has = p2Pillars.some((p) => p.jiji === a || p.jiji === b);
    if (p1Has && p2Has) {
      const p1Match = p1Pillars.find((p) => p.jiji === a || p.jiji === b);
      const p2Match = p2Pillars.find((p) => p.jiji === a || p.jiji === b);
      if (p1Match && p2Match && p1Match.jiji !== p2Match.jiji) {
        jijiHap.push(`${a}-${b} 육합`);
      }
    }
  }

  for (const trio of JIJI_SAMHAP) {
    const allJiji = [...p1Pillars.map((p) => p.jiji), ...p2Pillars.map((p) => p.jiji)];
    if (trio.every((j) => allJiji.includes(j))) {
      jijiHap.push(`${trio.join("-")} 삼합`);
    }
  }

  const jijiChung = checkJijiPairs(p1Pillars, p2Pillars, JIJI_CHUNG, "충");
  const jijiHyung = checkJijiPairs(p1Pillars, p2Pillars, JIJI_HYUNG, "형");
  const jijiPa = checkJijiPairs(p1Pillars, p2Pillars, JIJI_PA, "파");
  const jijiHae = checkJijiPairs(p1Pillars, p2Pillars, JIJI_HAE, "해");

  // 오행 보완 분석
  const oh1 = person1.ohpiAnalysis;
  const oh2 = person2.ohpiAnalysis;
  const complementary: string[] = [];
  for (const oh of OHANG_LIST) {
    if (oh1.counts[oh] <= 1 && oh2.counts[oh] >= 2) {
      complementary.push(`${oh}(상대방이 보완)`);
    }
    if (oh2.counts[oh] <= 1 && oh1.counts[oh] >= 2) {
      complementary.push(`${oh}(내가 보완)`);
    }
  }

  // === 점수 계산 (궁 기반 가중치) ===
  let score = 50;
  // 일주(가장 중요) - 가중치 x2
  score += ilganScore;
  score += iljiScore;
  // 전체 기둥 합/충
  score += cheonganHap.length * 5;
  score += jijiHap.length * 5;
  score -= jijiChung.length * 5;
  score -= jijiHyung.length * 3;
  score -= jijiPa.length * 2;
  score -= jijiHae.length * 2;
  score += complementary.length * 3;
  score = Math.max(20, Math.min(98, score));

  const ohangBalance =
    complementary.length > 0
      ? `서로의 오행을 보완합니다: ${complementary.join(", ")}`
      : "오행 구성이 비슷합니다.";

  return {
    score,
    cheonganHap,
    jijiHap,
    jijiChung,
    jijiHyung,
    jijiPa,
    jijiHae,
    ilganRelation,
    iljiRelation,
    ohangBalance,
  };
}

// 지지 쌍 관계 체크 헬퍼
function checkJijiPairs(
  p1Pillars: Pillar[], p2Pillars: Pillar[],
  pairs: [string, string][], label: string,
): string[] {
  const results: string[] = [];
  for (const [a, b] of pairs) {
    const p1Has = p1Pillars.some((p) => p.jiji === a || p.jiji === b);
    const p2Has = p2Pillars.some((p) => p.jiji === a || p.jiji === b);
    if (p1Has && p2Has) {
      const p1Match = p1Pillars.find((p) => p.jiji === a || p.jiji === b);
      const p2Match = p2Pillars.find((p) => p.jiji === a || p.jiji === b);
      if (p1Match && p2Match && p1Match.jiji !== p2Match.jiji) {
        results.push(`${a}-${b} ${label}`);
      }
    }
  }
  return results;
}

function getAllPillars(saju: SajuResultData): Pillar[] {
  return [
    saju.pillars.year,
    saju.pillars.month,
    saju.pillars.day,
    ...(saju.pillars.hour ? [saju.pillars.hour] : []),
  ];
}
