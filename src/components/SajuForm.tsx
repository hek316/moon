"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encodeShareData } from "@/lib/share";
import { HOUR_LABELS, HOUR_VALUES } from "@/constants/saju";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function SajuForm() {
  const router = useRouter();
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [loading, setLoading] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const encoded = encodeShareData({ year, month, day, hour });
    router.push(`/result/${encoded}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 생년 */}
      <div>
        <label className="mb-2 block text-xs tracking-wider text-ivory-dim">
          태어난 해
        </label>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="select-field"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
      </div>

      {/* 생월/생일 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs tracking-wider text-ivory-dim">월</label>
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              const maxDay = getDaysInMonth(year, Number(e.target.value));
              if (day > maxDay) setDay(maxDay);
            }}
            className="select-field"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-wider text-ivory-dim">일</label>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="select-field"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 생시 */}
      <div>
        <label className="mb-2 block text-xs tracking-wider text-ivory-dim">
          태어난 시간
        </label>
        <select
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="select-field"
        >
          {HOUR_LABELS.map((label, i) => (
            <option key={i} value={HOUR_VALUES[i]}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* 제출 */}
      <div className="pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="animate-glow-pulse">운명을 읽는 중...</span>
          ) : (
            "사주팔자 보기"
          )}
        </button>
      </div>
    </form>
  );
}
