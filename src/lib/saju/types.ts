export interface SajuInput {
  year: number;
  month: number;
  day: number;
  hour: number; // 0~23 (시진 대표 시간)
  isLunar?: boolean;
  gender?: "male" | "female";
}

export interface Pillar {
  hangul: string;    // 예: "갑자"
  hanja: string;     // 예: "甲子"
  cheongan: string;  // 천간 한글 (예: "갑")
  jiji: string;      // 지지 한글 (예: "자")
  cheonganOhang: string; // 천간 오행
  jijiOhang: string;     // 지지 오행
  eumyang: boolean;      // 천간 음양 (양=true)
  jijanggan: string[];   // 지지의 지장간 배열
  sipsin?: string;       // 천간의 십신 (일간 기준)
  jijangganSipsin?: string[]; // 지장간 각각의 십신
  unsung?: string;       // 12운성 (일간 기준)
}

// 십신 종류
export type SipsinName =
  | "비견" | "겁재"   // 비겁 (같은 오행)
  | "식신" | "상관"   // 식상 (내가 생하는 것)
  | "편재" | "정재"   // 재성 (내가 극하는 것)
  | "편관" | "정관"   // 관성 (나를 극하는 것)
  | "편인" | "정인";  // 인성 (나를 생하는 것)

// 십신 그룹
export type SipsinGroup = "비겁" | "식상" | "재성" | "관성" | "인성";

export interface SipsinAnalysis {
  // 각 위치의 십신
  yearCheongan: SipsinName;
  monthCheongan: SipsinName;
  hourCheongan?: SipsinName;
  // 지장간 십신
  yearJijanggan: SipsinName[];
  monthJijanggan: SipsinName[];
  dayJijanggan: SipsinName[];
  hourJijanggan?: SipsinName[];
  // 십신 분포 카운트 (천간 + 지장간 본기)
  distribution: Record<SipsinGroup, number>;
}

export interface StrengthResult {
  score: number;       // -10 ~ +10
  level: "신강" | "신약" | "중화";
  deukryeong: boolean; // 득령 여부
  deukji: boolean;     // 득지 여부
  deukse: boolean;     // 득세 여부
  description: string; // 판정 근거 설명
}

export interface YongsinResult {
  yongsin: string;     // 용신 오행
  huisin: string;      // 희신 오행
  gisin: string;       // 기신 오행
  gusin: string;       // 구신 오행
  description: string; // 용신 결정 근거
}

export type GyeokgukName =
  | "정관격" | "편관격" | "정인격" | "편인격"
  | "식신격" | "상관격" | "정재격" | "편재격"
  | "건록격" | "양인격" | "특수격";

export interface GyeokgukResult {
  name: GyeokgukName;
  description: string;
}

// 대운 한 기둥
export interface DaeunPillar {
  cheongan: string;
  jiji: string;
  hangul: string;
  startAge: number;   // 시작 나이
  endAge: number;     // 종료 나이
}

export interface DaeunResult {
  direction: "순행" | "역행";
  startAge: number;            // 대운 시작 나이
  pillars: DaeunPillar[];      // 대운 기둥 배열 (10개)
  currentDaeun?: DaeunPillar;  // 현재 대운
  currentAge: number;          // 현재 나이
}

// 세운 (해당 년도 운)
export interface SeunResult {
  year: number;
  cheongan: string;
  jiji: string;
  hangul: string;
  sipsin: SipsinName;      // 세운 천간의 십신
  unsung: string;          // 세운 지지의 12운성
}

export interface SajuResultData {
  input: SajuInput;
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  ohpiAnalysis: OhangAnalysis;
  sipsinAnalysis?: SipsinAnalysis;
  strengthResult?: StrengthResult;
  yongsinResult?: YongsinResult;
  gyeokgukResult?: GyeokgukResult;
  daeunResult?: DaeunResult;
  seunResult?: SeunResult;
}

export interface OhangAnalysis {
  counts: Record<string, number>; // 목/화/토/금/수 각 갯수
  total: number;
  dominant: string;   // 가장 많은 오행
  weak: string;       // 가장 적은 오행
  percentages: Record<string, number>;
  // 지장간 포함 오행 분석
  jijangganCounts?: Record<string, number>;
  jijangganTotal?: number;
}

export interface SajuInterpretation {
  summary: string;       // 한 줄 요약
  personality: string;   // 성격
  career: string;        // 직업/적성
  relationship: string;  // 대인관계
  advice: string;        // 조언
  luckyElements: string; // 행운의 요소
}

export interface CompatibilityInput {
  person1: SajuInput;
  person2: SajuInput;
}

export interface CompatibilityResultData {
  person1: SajuResultData;
  person2: SajuResultData;
  score: number;           // 0~100
  cheonganHap: string[];   // 천간합 목록
  jijiHap: string[];       // 지지합 목록
  jijiChung: string[];     // 지지충 목록
  jijiHyung: string[];     // 지지형 목록
  jijiPa: string[];        // 지지파 목록
  jijiHae: string[];       // 지지해 목록
  ilganRelation: string;   // 일간 관계 설명
  iljiRelation: string;    // 일지 관계 설명
  ohangBalance: string;    // 오행 보완 설명
}

export interface CompatibilityInterpretation {
  summary: string;
  strengths: string;
  challenges: string;
  advice: string;
}
