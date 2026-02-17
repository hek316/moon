import type { Metadata } from "next";
import { Nanum_Myeongjo, Nanum_Pen_Script } from "next/font/google";
import "./globals.css";

const nanumMyeongjo = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-myeongjo",
});

const nanumPen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pen",
});

export const metadata: Metadata = {
  title: "달빛사주 - 나의 사주팔자 보기",
  description:
    "생년월일시로 보는 전통 사주팔자와 AI 해석. 친구와 공유하고 궁합도 확인해보세요.",
  openGraph: {
    title: "달빛사주 - 나의 사주팔자 보기",
    description: "생년월일시로 보는 전통 사주팔자와 AI 해석",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${nanumMyeongjo.variable} ${nanumPen.variable} antialiased`}
      >
        <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-5 py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
