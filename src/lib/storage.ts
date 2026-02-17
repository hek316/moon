const STORAGE_KEY = "moon_saju_v1";
const VALID_HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
const currentYear = new Date().getFullYear();

export interface BirthData {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: "male" | "female";
  isLunar: boolean;
}

function isValid(data: unknown): data is BirthData {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.year === "number" &&
    Number.isInteger(d.year) &&
    d.year >= 1900 &&
    d.year <= currentYear &&
    typeof d.month === "number" &&
    Number.isInteger(d.month) &&
    d.month >= 1 &&
    d.month <= 12 &&
    typeof d.day === "number" &&
    Number.isInteger(d.day) &&
    d.day >= 1 &&
    d.day <= 31 &&
    typeof d.hour === "number" &&
    VALID_HOURS.includes(d.hour) &&
    (d.gender === "male" || d.gender === "female") &&
    typeof d.isLunar === "boolean"
  );
}

export function saveBirthData(data: BirthData): void {
  if (!isValid(data)) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

export function loadBirthData(): BirthData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
    // 검증 실패 시 삭제
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

export function clearBirthData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage 접근 불가 시 무시
  }
}

export function hasBirthData(): boolean {
  return loadBirthData() !== null;
}
