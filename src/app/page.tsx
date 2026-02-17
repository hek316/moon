import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {/* 달빛 장식 */}
      <div className="animate-fade-in-slow mb-6">
        <div className="relative">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full opacity-60"
            style={{
              background: "radial-gradient(circle at 35% 35%, #E8D5A8 0%, #C9A96E 40%, rgba(201, 169, 110, 0.3) 70%, transparent 100%)",
              boxShadow: "0 0 40px rgba(201, 169, 110, 0.2), 0 0 80px rgba(201, 169, 110, 0.08)",
            }}
          />
        </div>
      </div>

      {/* 헤더 */}
      <header className="animate-fade-in mb-2 text-center" style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}>
        <h1
          className="mb-3 text-5xl tracking-wide text-moon"
          style={{ fontFamily: "var(--font-pen)" }}
        >
          달빛사주
        </h1>
        <p className="text-sm tracking-widest text-ivory-dim">
          달빛 아래, 당신의 운명을 읽다
        </p>
      </header>

      {/* 구분선 */}
      <div className="ink-divider my-8 w-48" style={{ animation: "ink-spread 1s ease-out 0.4s both" }} />

      {/* 서비스 카드 */}
      <div className="w-full space-y-4" style={{ animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both" }}>
        {/* 2026 운세 - 시즌 하이라이트 카드 */}
        <Link href="/fortune" className="group block">
          <div
            className="glass-card relative overflow-hidden rounded-2xl p-6 transition-all duration-300"
            style={{ borderColor: "rgba(201, 169, 110, 0.3)" }}
          >
            <div className="group-hover:opacity-100 opacity-0 absolute inset-0 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: "inset 0 0 24px rgba(201, 169, 110, 0.15)" }} />
            {/* 한자 장식 */}
            <span
              className="absolute right-4 top-3 text-5xl text-moon/10 select-none"
              style={{ fontFamily: "var(--font-pen)" }}
            >
              運
            </span>
            <div className="relative">
              <p className="mb-1 text-xs font-medium tracking-wider text-dawn">
                SEASON HIGHLIGHT
              </p>
              <h2
                className="mb-2 text-2xl tracking-wide text-moon"
                style={{ fontFamily: "var(--font-pen)" }}
              >
                2026 병오년 운세
              </h2>
              <p className="text-sm leading-relaxed text-ivory-dim">
                올해 나의 재물 · 연애 · 건강 · 직장운은?
              </p>
            </div>
          </div>
        </Link>

        {/* 사주 / 궁합 - 2열 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 사주팔자 카드 */}
          <Link href="/saju" className="group block">
            <div className="glass-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300 h-full group-hover:shadow-[0_0_20px_rgba(201,169,110,0.1)]">
              <span
                className="absolute right-3 top-2 text-4xl text-moon/10 select-none"
                style={{ fontFamily: "var(--font-pen)" }}
              >
                命
              </span>
              <div className="relative">
                <h2
                  className="mb-2 text-xl tracking-wide text-moon"
                  style={{ fontFamily: "var(--font-pen)" }}
                >
                  사주팔자
                </h2>
                <p className="text-xs leading-relaxed text-ivory-dim">
                  나의 운명을 읽다
                </p>
              </div>
            </div>
          </Link>

          {/* 궁합 카드 */}
          <Link href="/compatibility" className="group block">
            <div className="glass-card relative overflow-hidden rounded-2xl p-5 transition-all duration-300 h-full group-hover:shadow-[0_0_20px_rgba(201,169,110,0.1)]">
              <span
                className="absolute right-3 top-2 text-4xl text-moon/10 select-none"
                style={{ fontFamily: "var(--font-pen)" }}
              >
                緣
              </span>
              <div className="relative">
                <h2
                  className="mb-2 text-xl tracking-wide text-moon"
                  style={{ fontFamily: "var(--font-pen)" }}
                >
                  궁합보기
                </h2>
                <p className="text-xs leading-relaxed text-ivory-dim">
                  두 사람의 인연
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-ivory-dim/30">
        재미로 보는 사주입니다
      </p>
    </div>
  );
}
