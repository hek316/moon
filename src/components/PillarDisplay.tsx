import type { Pillar } from "@/lib/saju/types";
import { OHANG_COLOR } from "@/constants/saju";

interface PillarDisplayProps {
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
}

const LABELS = ["시주", "일주", "월주", "년주"];

export default function PillarDisplay({ pillars }: PillarDisplayProps) {
  const pillarList = [pillars.hour, pillars.day, pillars.month, pillars.year];

  return (
    <div className="flex justify-center gap-4">
      {pillarList.map((pillar, i) => (
        <div
          key={i}
          className="flex flex-col items-center"
          style={{ animation: `fade-in 0.6s ease-out ${0.1 * i}s both` }}
        >
          <span className="mb-2 text-[11px] tracking-widest text-ivory-dim/60">
            {LABELS[i]}
          </span>
          <div className="glass-card-inner flex flex-col items-center gap-1 rounded-xl p-2.5">
            {pillar ? (
              <>
                {/* 천간 */}
                <div
                  className="pillar-cell"
                  style={{
                    color: OHANG_COLOR[pillar.cheonganOhang] ?? "#E8DFD0",
                    background: `${OHANG_COLOR[pillar.cheonganOhang] ?? "#E8DFD0"}10`,
                  }}
                >
                  {pillar.hanja[0]}
                </div>
                {/* 구분 */}
                <div className="h-px w-8" style={{
                  background: `linear-gradient(90deg, transparent, ${OHANG_COLOR[pillar.cheonganOhang] ?? "#E8DFD0"}30, transparent)`
                }} />
                {/* 지지 */}
                <div
                  className="pillar-cell"
                  style={{
                    color: OHANG_COLOR[pillar.jijiOhang] ?? "#E8DFD0",
                    background: `${OHANG_COLOR[pillar.jijiOhang] ?? "#E8DFD0"}10`,
                  }}
                >
                  {pillar.hanja[1]}
                </div>
                {/* 한글 */}
                <span className="mt-1.5 text-[11px] text-ivory-dim/50">
                  {pillar.hangul}
                </span>
              </>
            ) : (
              <div className="flex h-[8.5rem] w-14 items-center justify-center text-[11px] text-ivory-dim/30">
                미입력
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
