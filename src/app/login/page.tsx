'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import KakaoLoginButton from '@/components/auth/KakaoLoginButton';
import LoginForm from '@/components/auth/LoginForm';

// 에러 메시지 매핑
const errorMessages: Record<string, string> = {
  kakao_init_failed: '카카오 로그인을 시작할 수 없습니다.',
  kakao_denied: '카카오 로그인이 취소되었습니다.',
  no_code: '인증 코드를 받지 못했습니다.',
  invalid_state: '유효하지 않은 요청입니다. 다시 시도해주세요.',
  callback_failed: '로그인 처리 중 오류가 발생했습니다.',
};

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const redirect = searchParams.get('redirect') || '/';
  const errorMessage = error ? errorMessages[error] || '로그인에 실패했습니다.' : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* 로고 및 타이틀 */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🧪</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">MBTI Lab 로그인</h1>
            <p className="text-gray-600 dark:text-gray-400">
              로그인하고 나의 MBTI 결과를 저장하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">
                {errorMessage}
              </p>
            </div>
          )}

          {/* 로그인 카드 */}
          <div className="card p-6 md:p-8">
            {/* 카카오 로그인 */}
            <KakaoLoginButton redirectTo={redirect} />

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">
                  또는 이메일로 로그인
                </span>
              </div>
            </div>

            {/* 이메일 로그인 폼 */}
            <LoginForm redirectTo={redirect} />

            {/* 회원가입 링크 */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              계정이 없으신가요?{' '}
              <Link
                href={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-primary hover:text-primary-dark font-medium"
              >
                회원가입
              </Link>
            </p>
          </div>

          {/* 하단 안내 */}
          <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            로그인하면 MBTI Lab의{' '}
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
