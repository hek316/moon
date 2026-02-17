import { calculateSaju, lunarToSolar } from "@fullstackfamily/manseryeok";
import type { SajuInput, SajuResultData, Pillar, GyeokgukResult, GyeokgukName } from "./types";
import {
  CHEONGAN_OHANG, JIJI_OHANG, CHEONGAN_EUMYANG, JIJANGGAN,
  JIJI, TWELVE_UNSUNG, TWELVE_UNSUNG_NAMES,
} from "@/constants/saju";
import { analyzeOhang } from "./analysis";
import { analyzeSipsin, calculateSipsin } from "./sipsin";
import { analyzeStrength } from "./strength";
import { determineYongsin } from "./yongsin";
import { calculateDaeun, calculateSeun } from "./daeun";

// 사주팔자 2글자를 분리하여 Pillar 객체 생성
function parsePillar(hangul: string, hanja: string): Pillar {
  const cheongan = hangul[0];
  const jiji = hangul[1];
  return {
    hangul,
    hanja,
    cheongan,
    jiji,
    cheonganOhang: CHEONGAN_OHANG[cheongan] ?? "?",
    jijiOhang: JIJI_OHANG[jiji] ?? "?",
    eumyang: CHEONGAN_EUMYANG[cheongan] ?? true,
    jijanggan: JIJANGGAN[jiji] ?? [],
  };
}

// 12운성 계산 (일간 기준)
function getUnsung(ilgan: string, jiji: string): string {
  const jijiIndex = JIJI.indexOf(jiji as typeof JIJI[number]);
  if (jijiIndex === -1) return "?";
  const unsungTable = TWELVE_UNSUNG[ilgan];
  if (!unsungTable) return "?";
  const unsungIndex = unsungTable[jijiIndex];
  return TWELVE_UNSUNG_NAMES[unsungIndex] ?? "?";
}

// 격국 판단 (월지 지장간 중 투간한 것 기준)
function analyzeGyeokguk(pillars: {
  year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null;
}): GyeokgukResult {
  const ilgan = pillars.day.cheongan;
  const monthJiji = pillars.month.jiji;
  const monthJijanggan = JIJANGGAN[monthJiji] ?? [];

  // 천간에 투출(드러나는)한 지장간 확인
  const visibleCheongans = [
    pillars.year.cheongan,
    pillars.month.cheongan,
    ...(pillars.hour ? [pillars.hour.cheongan] : []),
  ];

  // 월지 지장간 중 천간에 투출한 것을 찾음
  let gyeokGan: string | null = null;
  for (const jjg of monthJijanggan) {
    if (visibleCheongans.includes(jjg) && jjg !== ilgan) {
      gyeokGan = jjg;
      break;
    }
  }

  // 투간 없으면 월지 본기 사용
  if (!gyeokGan) {
    gyeokGan = monthJijanggan[0] ?? ilgan;
  }

  // 건록격/양인격 체크 (일간 자신이 월지에 건록/제왕이면)
  const monthUnsung = getUnsung(ilgan, monthJiji);
  if (monthUnsung === "건록") {
    return { name: "건록격", description: `월지 ${monthJiji}가 일간 ${ilgan}의 건록` };
  }
  if (monthUnsung === "제왕") {
    return { name: "양인격", description: `월지 ${monthJiji}가 일간 ${ilgan}의 제왕(양인)` };
  }

  // 격국 간의 십신으로 격국 결정
  if (gyeokGan === ilgan) {
    return { name: "건록격", description: "월지 본기가 일간과 동일" };
  }

  const sipsin = calculateSipsin(ilgan, gyeokGan);
  const sipsinToGyeok: Record<string, GyeokgukName> = {
    정관: "정관격", 편관: "편관격",
    정인: "정인격", 편인: "편인격",
    식신: "식신격", 상관: "상관격",
    정재: "정재격", 편재: "편재격",
    비견: "건록격", 겁재: "양인격",
  };

  const name = sipsinToGyeok[sipsin] ?? "특수격";
  return {
    name,
    description: `월지 ${monthJiji}의 투간 ${gyeokGan}(${sipsin})에 의한 ${name}`,
  };
}

// 사주팔자 계산 (전체 분석 파이프라인)
export function calculateSajuResult(input: SajuInput): SajuResultData {
  let { year, month, day } = input;
  const { hour } = input;

  // 음력 → 양력 변환
  if (input.isLunar) {
    const result = lunarToSolar(year, month, day);
    year = result.solar.year;
    month = result.solar.month;
    day = result.solar.day;
  }

  const saju = calculateSaju(year, month, day, hour, 0);

  const yearPillar = parsePillar(saju.yearPillar, saju.yearPillarHanja);
  const monthPillar = parsePillar(saju.monthPillar, saju.monthPillarHanja);
  const dayPillar = parsePillar(saju.dayPillar, saju.dayPillarHanja);
  const hourPillar =
    saju.hourPillar && saju.hourPillarHanja
      ? parsePillar(saju.hourPillar, saju.hourPillarHanja)
      : null;

  const pillars = { year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar };
  const ilgan = dayPillar.cheongan;

  // 십신 배치
  const sipsinAnalysis = analyzeSipsin(pillars);

  // 각 기둥에 십신/12운성 할당
  yearPillar.sipsin = sipsinAnalysis.yearCheongan;
  yearPillar.jijangganSipsin = sipsinAnalysis.yearJijanggan;
  yearPillar.unsung = getUnsung(ilgan, yearPillar.jiji);

  monthPillar.sipsin = sipsinAnalysis.monthCheongan;
  monthPillar.jijangganSipsin = sipsinAnalysis.monthJijanggan;
  monthPillar.unsung = getUnsung(ilgan, monthPillar.jiji);

  dayPillar.sipsin = "일간"; // 일간 자신
  dayPillar.jijangganSipsin = sipsinAnalysis.dayJijanggan;
  dayPillar.unsung = getUnsung(ilgan, dayPillar.jiji);

  if (hourPillar) {
    hourPillar.sipsin = sipsinAnalysis.hourCheongan;
    hourPillar.jijangganSipsin = sipsinAnalysis.hourJijanggan;
    hourPillar.unsung = getUnsung(ilgan, hourPillar.jiji);
  }

  // 오행 분석 (지장간 포함)
  const ohpiAnalysis = analyzeOhang(pillars);

  // 신강/신약 판단
  const strengthResult = analyzeStrength(pillars);

  // 용신/희신 결정
  const yongsinResult = determineYongsin(ilgan, strengthResult, sipsinAnalysis);

  // 격국 판단
  const gyeokgukResult = analyzeGyeokguk(pillars);

  // 대운 계산
  const daeunResult = input.gender
    ? calculateDaeun(input, pillars.month)
    : undefined;

  // 세운 계산 (2026년)
  const currentYear = new Date().getFullYear();
  const seunResult = calculateSeun(ilgan, currentYear);

  return {
    input,
    pillars,
    ohpiAnalysis,
    sipsinAnalysis,
    strengthResult,
    yongsinResult,
    gyeokgukResult,
    daeunResult,
    seunResult,
  };
}
