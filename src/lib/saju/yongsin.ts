import { CHEONGAN_OHANG, OHANG_SANGSAENG, OHANG_SANGGEUK } from "@/constants/saju";
import type { StrengthResult, YongsinResult, SipsinAnalysis } from "./types";

const OHANG_LIST = ["목", "화", "토", "금", "수"];

// 오행을 생하는 오행 (역방향 상생)
function getGenerator(ohang: string): string {
  // 수→목, 목→화, 화→토, 토→금, 금→수
  const reverseGenerate: Record<string, string> = {
    목: "수", 화: "목", 토: "화", 금: "토", 수: "금",
  };
  return reverseGenerate[ohang];
}

// 용신 결정
export function determineYongsin(
  ilgan: string,
  strength: StrengthResult,
  sipsin: SipsinAnalysis,
): YongsinResult {
  const ilganOhang = CHEONGAN_OHANG[ilgan];
  let yongsin: string;
  let description: string;

  if (strength.level === "신강") {
    // 신강: 일간의 힘이 강함 → 설기(식상), 극제(관성), 소모(재성) 필요
    // 우선순위: 식상(설기) > 재성(소모) > 관성(극제)
    const sishangOhang = OHANG_SANGSAENG[ilganOhang]; // 식상 오행
    const jaeOhang = OHANG_SANGGEUK[ilganOhang]; // 재성 오행
    const gwanOhang = Object.entries(OHANG_SANGGEUK).find(([, v]) => v === ilganOhang)?.[0] ?? ""; // 관성 오행

    // 식상이 가장 온건한 해법
    if (sipsin.distribution.식상 <= 2) {
      yongsin = sishangOhang;
      description = `신강 사주 → 설기(식상) 용신: ${sishangOhang}(${OHANG_LIST.indexOf(sishangOhang) >= 0 ? "활동/표현" : ""})`;
    } else if (sipsin.distribution.재성 <= 1) {
      yongsin = jaeOhang;
      description = `신강 사주 → 재성 용신: ${jaeOhang}(재물/실천)`;
    } else {
      yongsin = gwanOhang;
      description = `신강 사주 → 관성 용신: ${gwanOhang}(직업/규율)`;
    }
  } else if (strength.level === "신약") {
    // 신약: 일간의 힘이 약함 → 인성(생조), 비겁(도움) 필요
    const inOhang = getGenerator(ilganOhang); // 인성 오행 (나를 생하는 것)

    if (sipsin.distribution.인성 <= 1) {
      yongsin = inOhang;
      description = `신약 사주 → 인성 용신: ${inOhang}(학문/보호)`;
    } else {
      yongsin = ilganOhang;
      description = `신약 사주 → 비겁 용신: ${ilganOhang}(동료/힘)`;
    }
  } else {
    // 중화: 조후(계절 균형) 또는 통관 기준
    // 간략하게 가장 부족한 오행을 용신으로
    const ohangCounts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    // 십신 분포에서 역산
    ohangCounts[ilganOhang] += sipsin.distribution.비겁;
    ohangCounts[OHANG_SANGSAENG[ilganOhang]] += sipsin.distribution.식상;
    ohangCounts[OHANG_SANGGEUK[ilganOhang]] += sipsin.distribution.재성;
    const gwanOhang = Object.entries(OHANG_SANGGEUK).find(([, v]) => v === ilganOhang)?.[0] ?? "";
    ohangCounts[gwanOhang] += sipsin.distribution.관성;
    ohangCounts[getGenerator(ilganOhang)] += sipsin.distribution.인성;

    const weakest = OHANG_LIST.reduce((a, b) => (ohangCounts[a] <= ohangCounts[b] ? a : b));
    yongsin = weakest;
    description = `중화 사주 → 부족한 오행 보충: ${weakest}`;
  }

  // 희신: 용신을 생하는 오행
  const huisin = getGenerator(yongsin);

  // 기신: 용신을 극하는 오행
  const gisinEntry = Object.entries(OHANG_SANGGEUK).find(([, v]) => v === yongsin);
  const gisin = gisinEntry ? gisinEntry[0] : "";

  // 구신: 희신을 극하는 오행
  const gusinEntry = Object.entries(OHANG_SANGGEUK).find(([, v]) => v === huisin);
  const gusin = gusinEntry ? gusinEntry[0] : "";

  return { yongsin, huisin, gisin, gusin, description };
}
