import Link from "next/link";
import SajuForm from "@/components/SajuForm";

export default function SajuPage() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <header className="mb-2 text-center">
        <Link href="/">
          <h1
            className="text-3xl tracking-wide text-moon transition-opacity hover:opacity-70"
            style={{ fontFamily: "var(--font-pen)" }}
          >
            달빛사주
          </h1>
        </Link>
        <p className="mt-2 text-xs tracking-widest text-ivory-dim/50">
          나의 운명을 읽다
        </p>
      </header>

      <div className="ink-divider my-6 w-32" />

      <div
        className="glass-card w-full rounded-2xl p-7"
        style={{ animation: "fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both" }}
      >
        <p className="mb-6 text-center text-sm tracking-wider text-ivory-dim">
          생년월일시를 알려주세요
        </p>
        <SajuForm />
      </div>

      <div className="ink-divider mt-8 w-32" />
      <nav className="mt-5 flex gap-8">
        <Link href="/fortune" className="nav-link">
          2026 운세
        </Link>
        <Link href="/compatibility" className="nav-link">
          궁합 보기
        </Link>
      </nav>
    </div>
  );
}
