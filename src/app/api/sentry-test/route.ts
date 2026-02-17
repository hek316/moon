import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  // instrumentation이 안 되었을 경우 여기서 직접 초기화
  if (!Sentry.getClient()) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
    });
  }

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  const client = Sentry.getClient();

  try {
    throw new Error("Sentry 테스트: 서버 에러 확인용");
  } catch (error) {
    Sentry.captureException(error);
    const flushed = await Sentry.flush(5000);
    return NextResponse.json({
      ok: true,
      message: "에러가 Sentry로 전송되었습니다",
      debug: {
        hasDsn: !!dsn,
        dsnPrefix: dsn ? dsn.substring(0, 20) + "..." : "없음",
        clientActive: !!client,
        clientDsn: client?.getDsn()?.toString()?.substring(0, 20) + "..." || "없음",
        flushed,
        nodeEnv: process.env.NODE_ENV,
        runtime: process.env.NEXT_RUNTIME || "unknown",
      },
    });
  }
}
