import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

// 쿠키 이름 상수
export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';

// 기본 쿠키 옵션
const baseCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

/**
 * Access Token 쿠키 설정
 * 만료: 15분
 */
export async function setAccessTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: 15 * 60, // 15분 (초 단위)
  });
}

/**
 * Refresh Token 쿠키 설정
 * 만료: 7일
 * Path: /api/auth/refresh 로 제한
 */
export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60, // 7일 (초 단위)
    path: '/api/auth/refresh',
  });
}

/**
 * 양쪽 토큰 동시 설정 (로그인 시)
 */
export async function setAuthCookies(accessToken: string, refreshToken: string) {
  await setAccessTokenCookie(accessToken);
  await setRefreshTokenCookie(refreshToken);
}

/**
 * Access Token 쿠키 가져오기
 */
export async function getAccessTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}

/**
 * Refresh Token 쿠키 가져오기
 */
export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * 인증 쿠키 삭제 (로그아웃 시)
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, '', {
    ...baseCookieOptions,
    maxAge: 0,
  });

  cookieStore.set(REFRESH_TOKEN_COOKIE, '', {
    ...baseCookieOptions,
    maxAge: 0,
    path: '/api/auth/refresh',
  });
}

/**
 * Response 객체에 직접 쿠키 헤더 설정 (API Route 용)
 */
export function createCookieHeader(name: string, value: string, options: Partial<ResponseCookie>): string {
  const parts = [`${name}=${value}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${options.maxAge}`);
  }
  if (options.path) {
    parts.push(`Path=${options.path}`);
  }
  if (options.httpOnly) {
    parts.push('HttpOnly');
  }
  if (options.secure) {
    parts.push('Secure');
  }
  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  return parts.join('; ');
}

/**
 * 로그인 응답에 사용할 Set-Cookie 헤더 생성
 */
export function createAuthCookieHeaders(accessToken: string, refreshToken: string): string[] {
  const isProduction = process.env.NODE_ENV === 'production';

  return [
    createCookieHeader(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    }),
    createCookieHeader(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60,
    }),
  ];
}

/**
 * 로그아웃 응답에 사용할 Set-Cookie 헤더 생성
 */
export function createClearCookieHeaders(): string[] {
  const isProduction = process.env.NODE_ENV === 'production';

  return [
    createCookieHeader(ACCESS_TOKEN_COOKIE, '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    }),
    createCookieHeader(REFRESH_TOKEN_COOKIE, '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 0,
    }),
  ];
}
