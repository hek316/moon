import type { SajuInput } from "./saju/types";

/**
 * SajuInput을 base64url로 인코딩
 */
export function encodeShareData(input: SajuInput): string {
  const json = JSON.stringify({
    y: input.year,
    m: input.month,
    d: input.day,
    h: input.hour,
    g: input.gender ?? "",
  });
  // base64url 인코딩
  const base64 = btoa(json);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * base64url에서 SajuInput으로 디코딩
 */
export function decodeShareData(encoded: string): SajuInput | null {
  try {
    // base64url → base64
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";

    const json = atob(base64);
    const data = JSON.parse(json);

    if (!data.y || !data.m || !data.d) return null;

    return {
      year: data.y,
      month: data.m,
      day: data.d,
      hour: data.h ?? 12,
      gender: data.g || undefined,
    };
  } catch {
    return null;
  }
}
