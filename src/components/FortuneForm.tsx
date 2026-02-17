"use client";

import { useState, useEffect } from "react";
import { HOUR_LABELS, HOUR_VALUES } from "@/constants/saju";
import { saveBirthData, loadBirthData, clearBirthData } from "@/lib/storage";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

interface FortuneFormProps {
  onSubmit: (input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    gender: "male" | "female";
    isLunar: boolean;
  }) => void;
  loading: boolean;
}

export default function FortuneForm({ onSubmit, loading }: FortuneFormProps) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [gender, setGender] = useState<"male" | "female">("female");
  const [isLunar, setIsLunar] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    const saved = loadBirthData();
    if (saved) {
      setYear(saved.year);
      setMonth(saved.month);
      setDay(saved.day);
      setHour(saved.hour);
      setGender(saved.gender);
      setIsLunar(saved.isLunar);
      setHasSaved(true);
    }
  }, []);

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveBirthData({ year, month, day, hour, gender, isLunar });
    onSubmit({ year, month, day, hour, gender, isLunar });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 성별 & 음력 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs tracking-wider text-ivory-dim">
            성별
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female")}
            className="select-field"
          >
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-wider text-ivory-dim">
            달력
          </label>
          <select
            value={isLunar ? "lunar" : "solar"}
            onChange={(e) => setIsLunar(e.target.value === "lunar")}
            className="select-field"
          >
            <option value="solar">양력</option>
            <option value="lunar">음력</option>
          </select>
        </div>
      </div>

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
            <option key={y} value={y}>{y}년</option>
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
              const m = Number(e.target.value);
              setMonth(m);
              const maxDay = getDaysInMonth(year, m);
              if (day > maxDay) setDay(maxDay);
            }}
            className="select-field"
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}월</option>
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
              <option key={d} value={d}>{d}일</option>
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
            <option key={i} value={HOUR_VALUES[i]}>{label}</option>
          ))}
        </select>
      </div>

      {/* 제출 */}
      <div className="pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="animate-glow-pulse">운세를 읽는 중...</span>
          ) : (
            "2026년 운세 보기"
          )}
        </button>
      </div>

      {hasSaved && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              clearBirthData();
              setHasSaved(false);
              setYear(1990);
              setMonth(1);
              setDay(1);
              setHour(12);
              setGender("female");
              setIsLunar(false);
            }}
            className="text-xs text-ivory-dim/60 underline underline-offset-2 hover:text-ivory-dim transition-colors"
          >
            저장된 정보 삭제
          </button>
        </div>
      )}
    </form>
  );
}
