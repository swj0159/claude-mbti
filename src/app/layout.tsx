import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MBTI Lab - 3분 만에 알아보는 나의 MBTI',
  description:
    '12개 질문으로 빠르게 확인하는 MBTI 성격 유형 테스트. 회원가입 없이 무료로 테스트하고 결과를 친구들과 공유하세요!',
  keywords: ['MBTI', '성격 유형', '심리 테스트', 'MBTI 테스트', '무료 MBTI'],
  openGraph: {
    title: 'MBTI Lab - 3분 만에 알아보는 나의 MBTI',
    description: '12개 질문으로 빠르게 확인하세요',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
