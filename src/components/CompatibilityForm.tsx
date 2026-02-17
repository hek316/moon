"use client";

import { useState, useEffect } from "react";
import { HOUR_LABELS, HOUR_VALUES } from "@/constants/saju";
import { loadBirthData } from "@/lib/storage";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

interface PersonInput {
  year: number;
  month: number;
  day: number;
  hour: number;
}

interface CompatibilityFormProps {
  onSubmit: (person1: PersonInput, person2: PersonInput) => void;
  loading: boolean;
}

function PersonFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: PersonInput;
  onChange: (v: PersonInput) => void;
}) {
  const daysInMonth = getDaysInMonth(value.year, value.month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-3">
      <h3 className="text-center text-xs tracking-wider text-moon/70">{label}</h3>

      <select
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        className="select-field !text-sm !py-2.5"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-2">
        <select
          value={value.month}
          onChange={(e) => {
            const m = Number(e.target.value);
            const maxDay = getDaysInMonth(value.year, m);
            onChange({ ...value, month: m, day: Math.min(value.day, maxDay) });
          }}
          className="select-field !text-sm !py-2.5"
        >
          {months.map((m) => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
        <select
          value={value.day}
          onChange={(e) => onChange({ ...value, day: Number(e.target.value) })}
          className="select-field !text-sm !py-2.5"
        >
          {days.map((d) => (
            <option key={d} value={d}>{d}일</option>
          ))}
        </select>
      </div>

      <select
        value={value.hour}
        onChange={(e) => onChange({ ...value, hour: Number(e.target.value) })}
        className="select-field !text-sm !py-2.5"
      >
        {HOUR_LABELS.map((label, i) => (
          <option key={i} value={HOUR_VALUES[i]}>{label}</option>
        ))}
      </select>
    </div>
  );
}

export default function CompatibilityForm({ onSubmit, loading }: CompatibilityFormProps) {
  const [person1, setPerson1] = useState<PersonInput>({
    year: 1990, month: 1, day: 1, hour: 12,
  });
  const [person2, setPerson2] = useState<PersonInput>({
    year: 1992, month: 1, day: 1, hour: 12,
  });

  useEffect(() => {
    const saved = loadBirthData();
    if (saved) {
      setPerson1({
        year: saved.year,
        month: saved.month,
        day: saved.day,
        hour: saved.hour,
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(person1, person2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-5">
        <PersonFields label="첫 번째 사람" value={person1} onChange={setPerson1} />
        <PersonFields label="두 번째 사람" value={person2} onChange={setPerson2} />
      </div>

      <div className="pt-1">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="animate-glow-pulse">인연을 읽는 중...</span>
          ) : (
            "궁합 보기"
          )}
        </button>
      </div>
    </form>
  );
}
