'use client';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/lib/types';

interface UseUserResponse {
  user: AuthUser | null;
  error?: string;
}

interface FetchError extends Error {
  status?: number;
}

interface UseUserHookResult {
  user: AuthUser | null;
  isLoading: boolean;
  isError: boolean;
  error?: string;
  mutate: (
    data?: UseUserResponse | Promise<UseUserResponse>,
    shouldRevalidate?: boolean
  ) => Promise<UseUserResponse | undefined>;
}

interface UseLogoutHookResult {
  logout: () => Promise<void>;
}

const fetcher = async (url: string): Promise<UseUserResponse> => {
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error: FetchError = Object.assign(
      new Error('사용자 정보를 가져올 수 없습니다.'),
      { status: res.status as number }
    );
    throw error;
  }

  return (await res.json()) as UseUserResponse;
};

// 토큰 자동 갱신 중복 호출 방지용 플래그/Promise
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// refresh 루프 방지용 실패 카운터
let refreshFailCount = 0;
const MAX_REFRESH_ATTEMPTS = 2;

async function refreshToken(): Promise<boolean> {
  if (isRefreshing && refreshPromise !== null) {
    // 이미 다른 곳에서 refresh 중이면 그 결과를 그대로 사용
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        return false;
      }

      return true;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function getCurrentPathWithSearch(): string {
  if (typeof window === 'undefined') {
    return '/';
  }
  const { pathname, search } = window.location;
  return `${pathname}${search}`;
}

/**
 * 현재 로그인한 사용자 정보를 가져오는 훅
 * - Access Token 만료 시 /api/auth/refresh로 자동 갱신 시도
 * - refresh 실패 시 로그인 페이지로 리다이렉트
 */
export function useUser(): UseUserHookResult {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<
    UseUserResponse,
    FetchError
  >('/api/auth/me', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,

    // 1. 401 에러 발생 시: refresh 호출 → 성공 시 mutate, 실패 시 /login 리다이렉트
    onError: async (err: FetchError): Promise<void> => {
      // 1. 401이 아니면 여기서 할 일 없음 (네트워크/500 등은 onErrorRetry에서 처리)
      if (err.status !== 401) {
        return;
      }

      // 2. refresh가 이미 여러 번 실패했다면 더 시도하지 말고 바로 로그인으로
      if (refreshFailCount >= MAX_REFRESH_ATTEMPTS) {
        const from: string = getCurrentPathWithSearch();
        router.push(`/login?from=${encodeURIComponent(from)}`);
        return;
      }

      // 3. refresh 시도
      const refreshed: boolean = await refreshToken();

      if (!refreshed) {
        // refresh 자체가 실패 → 카운터 증가 후 로그인 페이지 이동
        refreshFailCount += 1;
        const from: string = getCurrentPathWithSearch();
        router.push(`/login?from=${encodeURIComponent(from)}`);
        return;
      }

      // 4. refresh 성공 → 실패 카운터 리셋 후 me 재요청
      refreshFailCount = 0;
      await mutate();
    },

    // 2. SWR 자체 재시도 로직: 401은 우리가 처리하니 재시도 금지, 그 외 에러는 최대 3회까지 5초 간격 재시도
    onErrorRetry: (
      error: FetchError,
      _key: string,
      _config: Readonly<unknown>,
      revalidate: (options?: { retryCount?: number }) => void,
      options: { retryCount: number }
    ): void => {
      // 401은 onError에서 이미 처리 → 자동 재시도 X
      if (error.status === 401) {
        return;
      }

      // 다른 에러는 최대 3회까지만 재시도
      if (options.retryCount >= 3) {
        return;
      }

      setTimeout(() => {
        revalidate({ retryCount: options.retryCount + 1 });
      }, 5000);
    },
  });

  return {
    user: data?.user ?? null,
    isLoading,
    isError: typeof error !== 'undefined',
    error: error?.message,
    mutate,
  };
}

/**
 * 로그아웃 후 사용자 정보 초기화
 */
export function useLogout(): UseLogoutHookResult {
  const { mutate } = useUser();

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // SWR 캐시 초기화 (유저 정보 null로)
      await mutate({ user: null }, false);

      // 홈으로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (logoutError: unknown) {
      // 타입은 unknown으로 두고, 여기서만 로깅
      // (콘솔 출력만 하므로 좁힐 필요까진 없음)
      // eslint-disable-next-line no-console
      console.error('로그아웃 오류:', logoutError);
    }
  };

  return { logout };
}
