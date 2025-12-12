'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const router = useRouter();
  const { mutate } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다.');
        return;
      }

      // SWR 캐시 갱신
      await mutate();

      // 리다이렉트
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 에러 메시지 */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* 이메일 */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="example@email.com"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-800 text-foreground
                     focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                     transition-all duration-200"
        />
      </div>

      {/* 비밀번호 */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="********"
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-800 text-foreground
                     focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none
                     transition-all duration-200"
        />
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3.5 rounded-xl font-medium transition-all duration-200
          ${isLoading
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
            : 'bg-primary hover:bg-primary-dark text-white'
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            로그인 중...
          </span>
        ) : (
          '로그인'
        )}
      </button>
    </form>
  );
}
