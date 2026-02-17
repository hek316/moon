import { CHEONGAN, JIJI, CHEONGAN_EUMYANG, CHEONGAN_OHANG, TWELVE_UNSUNG, TWELVE_UNSUNG_NAMES } from "@/constants/saju";
import type { SajuInput, Pillar, DaeunResult, DaeunPillar, SeunResult, SipsinName } from "./types";
import { calculateSipsin } from "./sipsin";

// 대운 계산
export function calculateDaeun(
  input: SajuInput,
  monthPillar: Pillar,
): DaeunResult {
  const { year, gender } = input;
  const yearGanEumyang = CHEONGAN_EUMYANG[getYearGan(year)];

  // 양남음녀 → 순행, 음남양녀 → 역행
  const isMale = gender === "male";
  const isForward = (yearGanEumyang && isMale) || (!yearGanEumyang && !isMale);
  const direction = isForward ? "순행" : "역행";

  // 대운 시작 나이 (간략 계산: 생월에 따라 1~9세)
  // 정확한 계산은 생일~절기 일수/3이지만, 간략하게 birth month 기반 근사
  const startAge = estimateDaeunStartAge(input);

  // 월주에서 순행/역행하며 대운 기둥 생성
  const monthGanIndex = CHEONGAN.indexOf(monthPillar.cheongan as typeof CHEONGAN[number]);
  const monthJiIndex = JIJI.indexOf(monthPillar.jiji as typeof JIJI[number]);

  const pillars: DaeunPillar[] = [];
  for (let i = 1; i <= 10; i++) {
    const step = isForward ? i : -i;
    const ganIndex = ((monthGanIndex + step) % 10 + 10) % 10;
    const jiIndex = ((monthJiIndex + step) % 12 + 12) % 12;
    const cheongan = CHEONGAN[ganIndex];
    const jiji = JIJI[jiIndex];
    const age = startAge + (i - 1) * 10;
    pillars.push({
      cheongan,
      jiji,
      hangul: `${cheongan}${jiji}`,
      startAge: age,
      endAge: age + 9,
    });
  }

  // 현재 나이 계산
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year + 1; // 한국 나이

  // 현재 대운 찾기
  const currentDaeun = pillars.find(
    (p) => currentAge >= p.startAge && currentAge <= p.endAge
  );

  return { direction, startAge, pillars, currentDaeun, currentAge };
}

// 대운 시작 나이 근사 계산
function estimateDaeunStartAge(input: SajuInput): number {
  // 간략 근사: 월의 중순 기준으로 절기까지 일수 / 3
  // 더 정확한 계산을 위해서는 절기 데이터가 필요하지만, 근사값 사용
  const dayInMonth = input.day;
  // 절기는 대략 월초(5~7일)에 바뀜
  const daysToJeolgi = Math.abs(dayInMonth - 6);
  const startAge = Math.max(1, Math.round(daysToJeolgi / 3));
  return startAge;
}

// 년간 구하기 (60갑자 기준)
function getYearGan(year: number): string {
  // 갑자년은 4로 나눠지는 해의 천간이 '갑'
  const ganIndex = (year - 4) % 10;
  return CHEONGAN[((ganIndex % 10) + 10) % 10];
}

// 세운 계산 (특정 년도의 운)
export function calculateSeun(ilgan: string, year: number): SeunResult {
  const ganIndex = ((year - 4) % 10 + 10) % 10;
  const jiIndex = ((year - 4) % 12 + 12) % 12;
  const cheongan = CHEONGAN[ganIndex];
  const jiji = JIJI[jiIndex];

  const sipsin = calculateSipsin(ilgan, cheongan);

  // 12운성
  const jijiIdx = JIJI.indexOf(jiji);
  const unsungTable = TWELVE_UNSUNG[ilgan];
  const unsungIndex = unsungTable?.[jijiIdx] ?? 0;
  const unsung = TWELVE_UNSUNG_NAMES[unsungIndex] ?? "?";

  return {
    year,
    cheongan,
    jiji,
    hangul: `${cheongan}${jiji}`,
    sipsin,
    unsung,
  };
}
