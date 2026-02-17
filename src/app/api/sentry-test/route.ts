import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("Sentry 테스트: 서버 에러 확인용");
  } catch (error) {
    Sentry.captureException(error);
    await Sentry.flush(2000);
    return NextResponse.json({ ok: true, message: "에러가 Sentry로 전송되었습니다" });
  }
}
