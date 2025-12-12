'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import RegisterForm from '@/components/auth/RegisterForm';
import KakaoLoginButton from '@/components/auth/KakaoLoginButton';

function RegisterContent() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* 로고 및 타이틀 */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🧪</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">회원가입</h1>
            <p className="text-gray-600 dark:text-gray-400">
              계정을 만들고 MBTI 여정을 시작하세요
            </p>
          </div>

          {/* 회원가입 카드 */}
          <div className="card p-6 md:p-8">
            {/* 카카오로 시작하기 */}
            <KakaoLoginButton redirectTo={redirect} />

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                  또는 이메일로 가입
                </span>
              </div>
            </div>

            {/* 회원가입 폼 */}
            <RegisterForm redirectTo={redirect} />

            {/* 로그인 링크 */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              이미 계정이 있으신가요?{' '}
              <Link
                href={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="text-primary hover:text-primary-dark font-medium"
              >
                로그인
              </Link>
            </p>
          </div>

          {/* 하단 안내 */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            가입하면 MBTI Lab의{' '}
            <Link href="/terms" className="underline hover:text-primary">
              이용약관
            </Link>
            {' '}및{' '}
            <Link href="/privacy" className="underline hover:text-primary">
              개인정보처리방침
            </Link>
            에 동의하게 됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
