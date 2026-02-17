import type { Metadata } from "next";
import Link from "next/link";
import { decodeShareData } from "@/lib/share";
import SajuResult from "@/components/SajuResult";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const input = decodeShareData(id);

  if (!input) {
    return { title: "달빛사주 - 잘못된 링크" };
  }

  return {
    title: `${input.year}년 ${input.month}월 ${input.day}일생의 사주 - 달빛사주`,
    description: `${input.year}년 ${input.month}월 ${input.day}일생의 사주팔자와 AI 해석을 확인해보세요.`,
    openGraph: {
      title: `${input.year}년 ${input.month}월 ${input.day}일생의 사주 - 달빛사주`,
      description: "전통 사주팔자와 AI가 읽어주는 나의 운명",
    },
  };
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const input = decodeShareData(id);

  if (!input) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <p className="text-lg text-dawn">잘못된 링크입니다.</p>
        <Link href="/" className="nav-link mt-4">
          처음으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <header className="mb-8 text-center">
        <Link href="/">
          <h1
            className="text-3xl tracking-wide text-moon transition-opacity hover:opacity-70"
            style={{ fontFamily: "var(--font-pen)" }}
          >
            달빛사주
          </h1>
        </Link>
      </header>

      <div className="glass-card w-full rounded-2xl p-7">
        <SajuResult input={input} />
      </div>

      <div className="ink-divider mt-8 w-32" />
      <nav className="mt-5 flex gap-8">
        <Link href="/" className="nav-link">
          다시 보기
        </Link>
        <Link href="/compatibility" className="nav-link">
          궁합 보기
        </Link>
      </nav>
    </div>
  );
}
