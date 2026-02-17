import { CHEONGAN_OHANG, CHEONGAN_EUMYANG, JIJANGGAN } from "@/constants/saju";
import type { SipsinName, SipsinGroup, SipsinAnalysis, Pillar } from "./types";

// 오행 관계 → 십신 그룹 매핑
// 비겁: 같은 오행, 식상: 내가 생, 재성: 내가 극, 관성: 나를 극, 인성: 나를 생
const OHANG_RELATION: Record<string, SipsinGroup> = {
  same: "비겁",
  iGenerate: "식상",
  iControl: "재성",
  controlsMe: "관성",
  generatesMe: "인성",
};

// 오행 상생 관계 (A가 B를 생)
const GENERATES: Record<string, string> = {
  목: "화", 화: "토", 토: "금", 금: "수", 수: "목",
};

// 오행 상극 관계 (A가 B를 극)
const CONTROLS: Record<string, string> = {
  목: "토", 화: "금", 토: "수", 금: "목", 수: "화",
};

// 일간 오행 기준으로 대상 오행의 관계(그룹)를 구함
function getOhangRelation(ilganOhang: string, targetOhang: string): SipsinGroup {
  if (ilganOhang === targetOhang) return "비겁";
  if (GENERATES[ilganOhang] === targetOhang) return "식상";
  if (CONTROLS[ilganOhang] === targetOhang) return "재성";
  if (CONTROLS[targetOhang] === ilganOhang) return "관성";
  // 나머지는 인성 (targetOhang이 ilganOhang을 생)
  return "인성";
}

// 십신 결정: 오행 관계 + 음양으로 10가지 십신 확정
export function calculateSipsin(ilgan: string, target: string): SipsinName {
  const ilganOhang = CHEONGAN_OHANG[ilgan];
  const targetOhang = CHEONGAN_OHANG[target];
  const ilganYang = CHEONGAN_EUMYANG[ilgan];
  const targetYang = CHEONGAN_EUMYANG[target];
  const sameYinYang = ilganYang === targetYang;

  const group = getOhangRelation(ilganOhang, targetOhang);

  const sipsinMap: Record<SipsinGroup, [SipsinName, SipsinName]> = {
    비겁: ["비견", "겁재"],       // 같은음양=비견, 다른음양=겁재
    식상: ["식신", "상관"],       // 같은음양=식신, 다른음양=상관
    재성: ["편재", "정재"],       // 같은음양=편재, 다른음양=정재
    관성: ["편관", "정관"],       // 같은음양=편관, 다른음양=정관
    인성: ["편인", "정인"],       // 같은음양=편인, 다른음양=정인
  };

  return sameYinYang ? sipsinMap[group][0] : sipsinMap[group][1];
}

// 십신이 속하는 그룹
export function getSipsinGroup(sipsin: SipsinName): SipsinGroup {
  const groupMap: Record<SipsinName, SipsinGroup> = {
    비견: "비겁", 겁재: "비겁",
    식신: "식상", 상관: "식상",
    편재: "재성", 정재: "재성",
    편관: "관성", 정관: "관성",
    편인: "인성", 정인: "인성",
  };
  return groupMap[sipsin];
}

// 전체 사주의 십신 분석
export function analyzeSipsin(pillars: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}): SipsinAnalysis {
  const ilgan = pillars.day.cheongan; // 일간이 기준

  // 천간 십신
  const yearCheongan = calculateSipsin(ilgan, pillars.year.cheongan);
  const monthCheongan = calculateSipsin(ilgan, pillars.month.cheongan);
  const hourCheongan = pillars.hour
    ? calculateSipsin(ilgan, pillars.hour.cheongan)
    : undefined;

  // 지장간 십신
  const calcJijangganSipsin = (jiji: string): SipsinName[] => {
    const jjg = JIJANGGAN[jiji] ?? [];
    return jjg.map((gan) => calculateSipsin(ilgan, gan));
  };

  const yearJijanggan = calcJijangganSipsin(pillars.year.jiji);
  const monthJijanggan = calcJijangganSipsin(pillars.month.jiji);
  const dayJijanggan = calcJijangganSipsin(pillars.day.jiji);
  const hourJijanggan = pillars.hour
    ? calcJijangganSipsin(pillars.hour.jiji)
    : undefined;

  // 십신 분포 (천간 + 각 지지 본기)
  const distribution: Record<SipsinGroup, number> = {
    비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0,
  };

  // 천간 카운트 (일간 자신은 비겁으로 카운트)
  distribution[getSipsinGroup(yearCheongan)]++;
  distribution[getSipsinGroup(monthCheongan)]++;
  distribution.비겁++; // 일간 자신
  if (hourCheongan) distribution[getSipsinGroup(hourCheongan)]++;

  // 지장간 본기(첫번째)만 카운트
  if (yearJijanggan[0]) distribution[getSipsinGroup(yearJijanggan[0])]++;
  if (monthJijanggan[0]) distribution[getSipsinGroup(monthJijanggan[0])]++;
  if (dayJijanggan[0]) distribution[getSipsinGroup(dayJijanggan[0])]++;
  if (hourJijanggan?.[0]) distribution[getSipsinGroup(hourJijanggan[0])]++;

  return {
    yearCheongan,
    monthCheongan,
    hourCheongan,
    yearJijanggan,
    monthJijanggan,
    dayJijanggan,
    hourJijanggan,
    distribution,
  };
}
