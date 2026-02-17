import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

// Sentry 연동 테스트용 엔드포인트 - 확인 후 삭제 가능
export async function GET() {
  const testError = new Error("Sentry Test: 의도적 테스트 에러입니다");

  logError(testError, {
    api: "sentry-test",
    category: "UNKNOWN",
    input: { test: true },
  });

  return NextResponse.json({
    ok: true,
    message: "테스트 에러가 Sentry로 전송되었습니다. 대시보드를 확인하세요.",
  });
}
