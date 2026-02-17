import Link from "next/link";
import SajuForm from "@/components/SajuForm";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      {/* 달빛 장식 */}
      <div className="animate-fade-in-slow mb-6">
        <div className="relative">
          {/* 달 이미지 - CSS로 표현 */}
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

      {/* 폼 카드 */}
      <div
        className="glass-card w-full rounded-2xl p-7"
        style={{ animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both" }}
      >
        <p className="mb-6 text-center text-sm tracking-wider text-ivory-dim">
          생년월일시를 알려주세요
        </p>
        <SajuForm />
      </div>

      {/* 하단 */}
      <div className="ink-divider mt-10 w-32" />
      <nav className="mt-5 flex gap-8">
        <Link href="/compatibility" className="nav-link">
          궁합 보기
        </Link>
      </nav>

      <p className="mt-10 text-center text-xs text-ivory-dim/30">
        재미로 보는 사주입니다
      </p>
    </div>
  );
}
