"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1) 클라이언트에서 직접 에러 발생 (Replay에 캡처됨)
  const triggerClientError = () => {
    throw new Error("Sentry Test: 클라이언트 에러입니다");
  };

  // 2) Sentry.captureException으로 에러 전송 (페이지 크래시 없이)
  const captureError = () => {
    Sentry.captureException(
      new Error("Sentry Test: captureException 테스트")
    );
    setApiResult("클라이언트 에러가 Sentry로 전송되었습니다.");
  };

  // 3) API Route 호출
  const callApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sentry-test");
      const data = await res.json();
      setApiResult(data.message);
    } catch (e) {
      setApiResult("API 호출 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "60px auto",
        padding: 32,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Sentry 테스트 페이지</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Session Replay가 이 페이지의 조작을 녹화합니다.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={captureError}
          style={{
            padding: "12px 20px",
            background: "#CC3333",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          에러 전송 (captureException)
        </button>

        <button
          onClick={callApi}
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "#3A6B8C",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "전송 중..." : "API Route 호출 (/api/sentry-test)"}
        </button>

        <button
          onClick={triggerClientError}
          style={{
            padding: "12px 20px",
            background: "#C4A265",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          클라이언트 크래시 (throw Error)
        </button>
      </div>

      {apiResult && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#f0f0f0",
            borderRadius: 8,
          }}
        >
          {apiResult}
        </div>
      )}
    </div>
  );
}
