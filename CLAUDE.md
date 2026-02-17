# 달빛사주 (Moon) - 사주 웹앱

## 기술 스택
- Next.js 14+ App Router + TypeScript
- Tailwind CSS v4
- @fullstackfamily/manseryeok (만세력/사주팔자 계산)
- @google/genai (Gemini API, gemini-2.0-flash)
- Vercel 배포

## 컨벤션
- 한국어 주석, 컴포넌트명은 영문 PascalCase
- 서버 컴포넌트 기본, 'use client'는 필요한 곳만
- API 키는 서버사이드(API Route)에서만 사용
- 공유 URL: base64url 인코딩 (DB 없음)

## 디자인 토큰
- 배경: #F5F0E8 (한지색)
- 텍스트: #2C2C2C (먹색)
- 강조: #CC3333 (주홍), #C4A265 (금색), #5B8C6F (비취)
- 오행: 목(#4A7C59), 화(#CC3333), 토(#C4A265), 금(#E8E0D0), 수(#3A6B8C)
- 폰트: 나눔명조(본문), 나눔펜스크립트(제목)
