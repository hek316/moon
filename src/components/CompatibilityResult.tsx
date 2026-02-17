import type { CompatibilityResultData, CompatibilityInterpretation } from "@/lib/saju/types";
import PillarDisplay from "./PillarDisplay";

interface CompatibilityResultProps {
  compatibility: CompatibilityResultData;
  interpretation: CompatibilityInterpretation;
}

export default function CompatibilityResult({
  compatibility,
  interpretation,
}: CompatibilityResultProps) {
  const { person1, person2, score, cheonganHap, jijiHap, jijiChung, jijiHyung, jijiPa, jijiHae } = compatibility;

  // 점수에 따라 달빛 색상 변화
  const scoreColor =
    score >= 80 ? "#C9A96E" : score >= 60 ? "#C4836A" : score >= 40 ? "#6B9080" : "#5A8BA0";

  return (
    <div className="animate-fade-in space-y-7">
      {/* 점수 */}
      <div className="text-center">
        <div className="relative inline-block">
          <div
            className="text-6xl font-bold"
            style={{ color: scoreColor, fontFamily: "var(--font-pen)" }}
          >
            {score}
          </div>
          <span className="absolute -right-5 top-2 text-sm text-ivory-dim/40">점</span>
        </div>
        <p className="mt-2 text-sm text-ivory-dim/60">{interpretation.summary}</p>
      </div>

      <div className="ink-divider" />

      {/* 두 사람 사주 */}
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-center text-[11px] tracking-wider text-moon/50">
            {person1.input.year}년 {person1.input.month}월 {person1.input.day}일생
          </p>
          <PillarDisplay pillars={person1.pillars} />
        </div>
        <div className="flex justify-center">
          <span className="text-lg text-moon/20">&amp;</span>
        </div>
        <div>
          <p className="mb-2 text-center text-[11px] tracking-wider text-moon/50">
            {person2.input.year}년 {person2.input.month}월 {person2.input.day}일생
          </p>
          <PillarDisplay pillars={person2.pillars} />
        </div>
      </div>

      <div className="ink-divider" />

      {/* 합/충 분석 */}
      <div className="space-y-2">
        {cheonganHap.length > 0 && (
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-dawn-soft">천간합</span>
            <span className="ml-2 text-xs text-ivory/70">{cheonganHap.join(", ")}</span>
          </div>
        )}
        {jijiHap.length > 0 && (
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-celadon">지지합</span>
            <span className="ml-2 text-xs text-ivory/70">{jijiHap.join(", ")}</span>
          </div>
        )}
        {jijiChung.length > 0 && (
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-oh-su">지지충</span>
            <span className="ml-2 text-xs text-ivory/70">{jijiChung.join(", ")}</span>
          </div>
        )}
        {jijiHyung.length > 0 && (
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-oh-hwa">지지형</span>
            <span className="ml-2 text-xs text-ivory/70">{jijiHyung.join(", ")}</span>
          </div>
        )}
        {jijiPa.length > 0 && (
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-oh-to">지지파</span>
            <span className="ml-2 text-xs text-ivory/70">{jijiPa.join(", ")}</span>
          </div>
        )}
        {jijiHae.length > 0 && (
          <div className="glass-card-inner rounded-lg p-3">
            <span className="text-xs font-bold text-oh-geum">지지해</span>
            <span className="ml-2 text-xs text-ivory/70">{jijiHae.join(", ")}</span>
          </div>
        )}
      </div>

      {/* AI 해석 */}
      <div className="space-y-3">
        {interpretation.strengths && (
          <div className="section-card" style={{ borderLeftColor: "rgba(107, 144, 128, 0.4)" }}>
            <h3 className="mb-2 text-xs font-bold tracking-wider text-celadon/80">좋은 궁합</h3>
            <p className="text-sm leading-[1.8] text-ivory/80">{interpretation.strengths}</p>
          </div>
        )}
        {interpretation.challenges && (
          <div className="section-card" style={{ borderLeftColor: "rgba(90, 139, 160, 0.4)" }}>
            <h3 className="mb-2 text-xs font-bold tracking-wider text-oh-su/80">참고할 점</h3>
            <p className="text-sm leading-[1.8] text-ivory/80">{interpretation.challenges}</p>
          </div>
        )}
        {interpretation.advice && (
          <div className="section-card" style={{ borderLeftColor: "rgba(201, 169, 110, 0.4)" }}>
            <h3 className="mb-2 text-xs font-bold tracking-wider text-moon/80">조언</h3>
            <p className="text-sm leading-[1.8] text-ivory/80">{interpretation.advice}</p>
          </div>
        )}
      </div>
    </div>
  );
}
