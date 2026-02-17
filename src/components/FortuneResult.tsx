import type { FortuneInterpretation } from "@/lib/saju/types";

interface FortuneResultProps {
  interpretation: FortuneInterpretation;
}

// 4대 운세 카드 설정
const fortuneCards = [
  { key: "wealth" as const, label: "재물운", icon: "財", color: "#C9A96E" },
  { key: "love" as const, label: "연애운", icon: "緣", color: "#C4836A" },
  { key: "health" as const, label: "건강운", icon: "康", color: "#5A9A6E" },
  { key: "career" as const, label: "직장운", icon: "職", color: "#5A8BA0" },
];

const currentMonth = new Date().getMonth() + 1;

export default function FortuneResult({ interpretation }: FortuneResultProps) {
  return (
    <div className="animate-fade-in space-y-7">
      {/* 연간 총운 */}
      <div className="text-center">
        <h2
          className="mb-3 text-2xl text-moon"
          style={{ fontFamily: "var(--font-pen)" }}
        >
          2026년 병오년 운세
        </h2>
        <p className="text-sm leading-[1.9] text-ivory/80">
          {interpretation.yearSummary}
        </p>
      </div>

      <div className="ink-divider" />

      {/* 4대 운세 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {fortuneCards.map(({ key, label, icon, color }) => (
          <div key={key} className="section-card" style={{ borderLeftColor: `${color}60` }}>
            <div className="mb-2 flex items-center gap-2">
              <span
                className="text-lg font-bold opacity-60"
                style={{ color, fontFamily: "var(--font-pen)" }}
              >
                {icon}
              </span>
              <h3 className="text-xs font-bold tracking-wider" style={{ color: `${color}CC` }}>
                {label}
              </h3>
            </div>
            <p className="text-xs leading-[1.8] text-ivory/75">
              {interpretation[key]}
            </p>
          </div>
        ))}
      </div>

      <div className="ink-divider" />

      {/* 월별 운세 */}
      <div>
        <h3
          className="mb-4 text-center text-lg text-moon/80"
          style={{ fontFamily: "var(--font-pen)" }}
        >
          월별 운세
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {interpretation.monthlyFortunes.map((mf) => {
            const isCurrent = mf.month === currentMonth;
            return (
              <div
                key={mf.month}
                className={`glass-card-inner rounded-lg p-3 ${
                  isCurrent ? "ring-1 ring-moon/40 bg-moon/10" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isCurrent
                        ? "bg-moon/20 text-moon"
                        : "bg-ivory/5 text-ivory-dim/50"
                    }`}
                  >
                    {mf.month}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs leading-[1.7] text-ivory/80">
                      {mf.summary}
                    </p>
                    {mf.lucky && (
                      <span className="mt-1 inline-block text-[10px] tracking-wider text-moon/50">
                        {mf.lucky}
                      </span>
                    )}
                  </div>
                  {isCurrent && (
                    <span className="shrink-0 text-[10px] tracking-wider text-moon/60">
                      NOW
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ink-divider" />

      {/* 행운 요소 & 조언 */}
      {interpretation.luckyElements && (
        <div className="section-card" style={{ borderLeftColor: "rgba(201, 169, 110, 0.4)" }}>
          <h3 className="mb-2 text-xs font-bold tracking-wider text-moon/80">
            행운의 요소
          </h3>
          <p className="text-sm leading-[1.8] text-ivory/80">
            {interpretation.luckyElements}
          </p>
        </div>
      )}

      {interpretation.advice && (
        <div className="section-card" style={{ borderLeftColor: "rgba(107, 144, 128, 0.4)" }}>
          <h3 className="mb-2 text-xs font-bold tracking-wider text-celadon/80">
            2026년 조언
          </h3>
          <p className="text-sm leading-[1.8] text-ivory/80">
            {interpretation.advice}
          </p>
        </div>
      )}
    </div>
  );
}
