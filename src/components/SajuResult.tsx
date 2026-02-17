"use client";

import { useEffect, useState } from "react";
import type { SajuResultData, SajuInterpretation, SajuInput } from "@/lib/saju/types";
import PillarDisplay from "./PillarDisplay";
import OhangChart from "./OhangChart";
import ShareButton from "./ShareButton";
import { OHANG_COLOR, OHANG_HANJA } from "@/constants/saju";

interface SajuResultProps {
  input: SajuInput;
}

interface ApiResponse {
  saju: SajuResultData;
  interpretation: SajuInterpretation;
}

export default function SajuResult({ input }: SajuResultProps) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSaju() {
      try {
        const res = await fetch("/api/saju", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "사주 계산에 실패했습니다.");
        }

        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchSaju();
  }, [input]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div
          className="mb-6 text-2xl text-moon animate-glow-pulse"
          style={{ fontFamily: "var(--font-pen)" }}
        >
          운명을 읽는 중...
        </div>
        <div className="flex gap-2">
          {["#5A9A6E", "#C4836A", "#C9A96E", "#B0A898", "#5A8BA0"].map(
            (color, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full animate-glow-pulse"
                style={{
                  backgroundColor: color,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            )
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card-inner rounded-xl p-6 text-center">
        <p className="text-dawn">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { saju, interpretation } = data;

  return (
    <div className="animate-fade-in space-y-7">
      {/* 제목 */}
      <div className="text-center">
        <h2
          className="text-3xl text-moon"
          style={{ fontFamily: "var(--font-pen)" }}
        >
          {input.year}년 {input.month}월 {input.day}일생
        </h2>
        {interpretation.summary && (
          <p className="mt-3 text-sm leading-relaxed text-ivory-dim/70">
            {interpretation.summary}
          </p>
        )}
      </div>

      <div className="ink-divider" />

      {/* 사주 네 기둥 */}
      <PillarDisplay pillars={saju.pillars} />

      <div className="ink-divider" />

      {/* 오행 차트 */}
      <OhangChart analysis={saju.ohpiAnalysis} />

      {/* 격국 & 신강/신약 & 용신 */}
      {(saju.gyeokgukResult || saju.strengthResult || saju.yongsinResult) && (
        <>
          <div className="ink-divider" />
          <div className="space-y-3">
            <h3 className="text-center text-xs tracking-[0.2em] text-ivory-dim/60">
              사주 분석
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {saju.gyeokgukResult && (
                <div className="glass-card-inner rounded-lg p-3">
                  <span className="text-xs font-bold text-moon/70">격국</span>
                  <span className="ml-2 text-sm text-ivory/90">{saju.gyeokgukResult.name}</span>
                  <p className="mt-1 text-[11px] text-ivory-dim/50">{saju.gyeokgukResult.description}</p>
                </div>
              )}
              {saju.strengthResult && (
                <div className="glass-card-inner rounded-lg p-3">
                  <span className="text-xs font-bold text-moon/70">일간 강약</span>
                  <span
                    className="ml-2 text-sm font-bold"
                    style={{
                      color: saju.strengthResult.level === "신강"
                        ? "#C4836A"
                        : saju.strengthResult.level === "신약"
                          ? "#5A8BA0"
                          : "#C9A96E",
                    }}
                  >
                    {saju.strengthResult.level}
                  </span>
                  <span className="ml-1 text-[11px] text-ivory-dim/50">
                    (점수: {saju.strengthResult.score > 0 ? "+" : ""}{saju.strengthResult.score})
                  </span>
                  <div className="mt-1.5 flex gap-3 text-[11px] text-ivory-dim/50">
                    <span>득령 {saju.strengthResult.deukryeong ? "○" : "×"}</span>
                    <span>득지 {saju.strengthResult.deukji ? "○" : "×"}</span>
                    <span>득세 {saju.strengthResult.deukse ? "○" : "×"}</span>
                  </div>
                </div>
              )}
              {saju.yongsinResult && (
                <div className="glass-card-inner rounded-lg p-3">
                  <span className="text-xs font-bold text-moon/70">용신</span>
                  <span
                    className="ml-2 text-sm font-bold"
                    style={{ color: OHANG_COLOR[saju.yongsinResult.yongsin] }}
                  >
                    {saju.yongsinResult.yongsin}({OHANG_HANJA[saju.yongsinResult.yongsin]})
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ivory-dim/50">
                    <span>
                      희신:{" "}
                      <span style={{ color: OHANG_COLOR[saju.yongsinResult.huisin] }}>
                        {saju.yongsinResult.huisin}
                      </span>
                    </span>
                    <span>
                      기신:{" "}
                      <span style={{ color: OHANG_COLOR[saju.yongsinResult.gisin] }}>
                        {saju.yongsinResult.gisin}
                      </span>
                    </span>
                    <span>
                      구신:{" "}
                      <span style={{ color: OHANG_COLOR[saju.yongsinResult.gusin] }}>
                        {saju.yongsinResult.gusin}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* 대운 */}
      {saju.daeunResult && (
        <>
          <div className="ink-divider" />
          <div className="space-y-3">
            <h3 className="text-center text-xs tracking-[0.2em] text-ivory-dim/60">
              대운 ({saju.daeunResult.direction} · {saju.daeunResult.startAge}세 시작)
            </h3>
            <div className="flex flex-wrap justify-center gap-1.5">
              {saju.daeunResult.pillars.map((p, i) => {
                const isCurrent = saju.daeunResult!.currentDaeun?.startAge === p.startAge;
                return (
                  <div
                    key={i}
                    className={`rounded-lg px-2.5 py-2 text-center ${
                      isCurrent
                        ? "ring-1 ring-moon/40 bg-moon/10"
                        : "glass-card-inner"
                    }`}
                  >
                    <div className="text-[10px] text-ivory-dim/40">
                      {p.startAge}~{p.endAge}세
                    </div>
                    <div className={`text-sm ${isCurrent ? "text-moon font-bold" : "text-ivory/80"}`}>
                      {p.hangul}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 세운 */}
      {saju.seunResult && (
        <>
          <div className="ink-divider" />
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-moon/70">{saju.seunResult.year}년 세운</span>
            <span className="ml-2 text-sm text-ivory/90">{saju.seunResult.hangul}</span>
            <span className="ml-2 text-[11px] text-ivory-dim/50">
              {saju.seunResult.sipsin} · {saju.seunResult.unsung}
            </span>
          </div>
        </>
      )}

      <div className="ink-divider" />

      {/* AI 해석 */}
      {interpretation.personality && (
        <div className="space-y-3">
          {interpretation.personality && (
            <Section title="성격과 기질" content={interpretation.personality} emoji="性" />
          )}
          {interpretation.career && (
            <Section title="직업과 적성" content={interpretation.career} emoji="業" />
          )}
          {interpretation.relationship && (
            <Section title="대인관계" content={interpretation.relationship} emoji="緣" />
          )}
          {interpretation.advice && (
            <Section title="조언" content={interpretation.advice} emoji="言" />
          )}
          {interpretation.luckyElements && (
            <Section
              title="행운의 요소"
              content={
                typeof interpretation.luckyElements === "string"
                  ? interpretation.luckyElements
                  : Object.entries(interpretation.luckyElements)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")
              }
              emoji="運"
            />
          )}
        </div>
      )}

      {/* 공유 */}
      <div className="flex justify-center pt-2">
        <ShareButton
          title="달빛사주 - 나의 사주팔자"
          text={`${input.year}년 ${input.month}월 ${input.day}일생의 사주를 확인해보세요!`}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  content,
  emoji,
}: {
  title: string;
  content: string;
  emoji: string;
}) {
  return (
    <div className="section-card">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base text-moon/40">{emoji}</span>
        <h3 className="text-xs font-bold tracking-wider text-moon/80">
          {title}
        </h3>
      </div>
      <p className="text-sm leading-[1.8] text-ivory/80">{content}</p>
    </div>
  );
}
