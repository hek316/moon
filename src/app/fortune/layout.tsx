import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2026년 병오년 운세 - 달빛사주",
  description:
    "2026년 병오년 무료 운세. 생년월일시로 보는 재물운, 연애운, 건강운, 직장운과 월별 운세를 AI가 풍부하게 해석해드립니다.",
  keywords: [
    "2026년 운세",
    "병오년 운세",
    "무료 운세",
    "사주 운세",
    "올해 운세",
    "신년 운세",
    "재물운",
    "연애운",
    "월별 운세",
  ],
  openGraph: {
    title: "2026년 병오년 운세 - 달빛사주",
    description:
      "2026년 병오년 무료 운세. AI가 해석하는 재물운, 연애운, 건강운, 직장운과 월별 운세.",
    type: "website",
  },
};

export default function FortuneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
