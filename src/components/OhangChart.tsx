import type { OhangAnalysis } from "@/lib/saju/types";
import { OHANG_COLOR, OHANG_HANJA, OHANG_DESC } from "@/constants/saju";

interface OhangChartProps {
  analysis: OhangAnalysis;
}

const OHANG_ORDER = ["목", "화", "토", "금", "수"];

export default function OhangChart({ analysis }: OhangChartProps) {
  const maxCount = Math.max(...Object.values(analysis.counts), 1);

  return (
    <div className="space-y-4">
      <h3 className="text-center text-xs tracking-[0.2em] text-ivory-dim/60">
        오행 분석
      </h3>
      <div className="space-y-2.5">
        {OHANG_ORDER.map((oh, idx) => {
          const count = analysis.counts[oh] ?? 0;
          const pct = analysis.percentages[oh] ?? 0;
          const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
          const isDominant = oh === analysis.dominant;
          const isWeak = oh === analysis.weak;
          const color = OHANG_COLOR[oh];

          return (
            <div
              key={oh}
              className="flex items-center gap-3"
              style={{ animation: `fade-in 0.5s ease-out ${0.08 * idx}s both` }}
            >
              <span
                className="w-7 text-right text-base font-bold"
                style={{ color }}
              >
                {OHANG_HANJA[oh]}
              </span>
              <div className="flex-1">
                <div className="h-4 w-full overflow-hidden rounded-sm"
                  style={{ background: `${color}10` }}
                >
                  <div
                    className="flex h-full items-center rounded-sm px-2 text-[10px] font-bold transition-all duration-1000"
                    style={{
                      width: `${Math.max(width, 6)}%`,
                      background: `linear-gradient(90deg, ${color}90, ${color})`,
                      color: "#111318",
                    }}
                  >
                    {count > 0 && count}
                  </div>
                </div>
              </div>
              <span className="w-9 text-right text-[11px] text-ivory-dim/50">
                {pct}%
              </span>
              {isDominant && (
                <span className="w-4 text-[10px] font-bold" style={{ color }}>
                  강
                </span>
              )}
              {isWeak && !isDominant && (
                <span className="w-4 text-[10px] text-ivory-dim/40">약</span>
              )}
              {!isDominant && !isWeak && <span className="w-4" />}
            </div>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-ivory-dim/50">
        가장 강한 기운{" "}
        <span style={{ color: OHANG_COLOR[analysis.dominant] }}>
          {analysis.dominant}({OHANG_HANJA[analysis.dominant]})
        </span>{" "}
        — {OHANG_DESC[analysis.dominant]}
      </p>
    </div>
  );
}
