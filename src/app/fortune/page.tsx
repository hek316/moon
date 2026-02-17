"use client";

import { useState } from "react";
import Link from "next/link";
import FortuneForm from "@/components/FortuneForm";
import FortuneResult from "@/components/FortuneResult";
import type { SajuResultData, FortuneInterpretation } from "@/lib/saju/types";

interface ApiResponse {
  saju: SajuResultData;
  interpretation: FortuneInterpretation;
}

export default function FortunePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: "male" | "female";
    isLunar: boolean;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "운세 계산에 실패했습니다.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
          2026년 병오년, 당신의 한 해를 읽다
        </p>
      </header>

      <div className="ink-divider my-6 w-32" />

      <div className="glass-card w-full rounded-2xl p-7">
        {!result ? (
          <>
            <p className="mb-6 text-center text-sm tracking-wider text-ivory-dim">
              생년월일시를 알려주세요
            </p>
            <FortuneForm onSubmit={handleSubmit} loading={loading} />
            {error && (
              <div className="mt-4 glass-card-inner rounded-lg p-3 text-center text-sm text-dawn">
                {error}
              </div>
            )}
            {loading && (
              <div className="mt-4 flex justify-center gap-2">
                {["#5A9A6E", "#C4836A", "#C9A96E", "#B0A898", "#5A8BA0"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full animate-glow-pulse"
                      style={{ backgroundColor: color, animationDelay: `${i * 0.3}s` }}
                    />
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <FortuneResult interpretation={result.interpretation} />
            <div className="mt-6 flex justify-center">
              <button onClick={() => setResult(null)} className="btn-secondary">
                다시 운세 보기
              </button>
            </div>
          </>
        )}
      </div>

      <div className="ink-divider mt-8 w-32" />
      <nav className="mt-5 flex gap-8">
        <Link href="/saju" className="nav-link">
          사주 보기
        </Link>
        <Link href="/compatibility" className="nav-link">
          궁합 보기
        </Link>
      </nav>
    </div>
  );
}
