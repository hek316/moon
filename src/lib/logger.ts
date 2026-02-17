import * as Sentry from "@sentry/nextjs";

export type ErrorCategory = "RATE_LIMIT" | "SERVER_ERROR" | "NETWORK" | "PARSE" | "UNKNOWN";

interface LogContext {
  api: string;
  category: ErrorCategory;
  statusCode?: number;
  input?: Record<string, unknown>;
  raw?: string;
}

// 생년월일 마스킹: 1990-03-15 → 1990-**-**
function maskPII(input: Record<string, unknown>): Record<string, unknown> {
  const masked = { ...input };
  if (masked.month) masked.month = "**";
  if (masked.day) masked.day = "**";
  if (masked.hour !== undefined) masked.hour = "**";
  return masked;
}

export function categorizeError(error: unknown): { category: ErrorCategory; statusCode?: number } {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    // Google GenAI SDK는 HTTP 상태코드를 에러 메시지에 포함
    if (msg.includes("429") || msg.includes("rate limit") || msg.includes("quota")) {
      return { category: "RATE_LIMIT", statusCode: 429 };
    }
    if (msg.includes("500") || msg.includes("internal server error") || msg.includes("503") || msg.includes("unavailable")) {
      return { category: "SERVER_ERROR", statusCode: 500 };
    }
    if (msg.includes("fetch") || msg.includes("network") || msg.includes("timeout") || msg.includes("econnrefused")) {
      return { category: "NETWORK" };
    }
  }
  if (error instanceof SyntaxError) {
    return { category: "PARSE" };
  }
  return { category: "UNKNOWN" };
}

export function logError(error: unknown, context: LogContext) {
  const maskedInput = context.input ? maskPII(context.input) : undefined;

  const structured = {
    timestamp: new Date().toISOString(),
    api: context.api,
    category: context.category,
    statusCode: context.statusCode,
    message: error instanceof Error ? error.message : String(error),
    input: maskedInput,
    raw: context.raw?.slice(0, 500), // 응답 원문 최대 500자
  };

  console.error(JSON.stringify(structured));

  Sentry.captureException(error, {
    tags: {
      api: context.api,
      errorCategory: context.category,
    },
    extra: {
      statusCode: context.statusCode,
      input: maskedInput,
      rawResponse: context.raw?.slice(0, 500),
    },
  });
}

export function getClientErrorMessage(category: ErrorCategory): string {
  switch (category) {
    case "RATE_LIMIT":
      return "요청이 많아 잠시 후 다시 시도해주세요.";
    case "SERVER_ERROR":
      return "AI 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해주세요.";
    case "NETWORK":
      return "네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.";
    case "PARSE":
      return "AI 응답 처리 중 오류가 발생했습니다.";
    default:
      return "AI 해석을 일시적으로 이용할 수 없습니다.";
  }
}
