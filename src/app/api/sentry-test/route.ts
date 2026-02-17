import * as SentryNextjs from "@sentry/nextjs";
import * as SentryNode from "@sentry/node";
import { NextResponse } from "next/server";

export async function GET() {
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

  // @sentry/nextjs 상태 확인
  const nextjsClient = SentryNextjs.getClient();

  // @sentry/nextjs가 안 되면 @sentry/node로 직접 시도
  if (!nextjsClient) {
    SentryNode.init({
      dsn,
      tracesSampleRate: 1.0,
    });
  }

  const nodeClient = SentryNode.getClient();
  const activeSentry = nextjsClient ? SentryNextjs : SentryNode;

  try {
    throw new Error("Sentry 테스트: 서버 에러 확인용");
  } catch (error) {
    activeSentry.captureException(error);
    const flushed = await activeSentry.flush(5000);
    return NextResponse.json({
      ok: true,
      message: "에러가 Sentry로 전송되었습니다",
      debug: {
        hasDsn: !!dsn,
        nextjsClientActive: !!nextjsClient,
        nodeClientActive: !!nodeClient,
        usedSdk: nextjsClient ? "nextjs" : "node",
        flushed,
        nodeEnv: process.env.NODE_ENV,
        runtime: process.env.NEXT_RUNTIME || "unknown",
        sentryInitKeys: Object.keys(SentryNextjs).filter(k => k === "init" || k === "getClient" || k === "captureException").length,
      },
    });
  }
}
