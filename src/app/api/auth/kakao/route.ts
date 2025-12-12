import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getKakaoAuthUrl, generateState } from '@/lib/auth/kakao';

/**
 * GET /api/auth/kakao
 * 카카오 로그인 시작 - 카카오 인증 페이지로 리다이렉트
 */
export async function GET(request: Request) {
  try {
    // CSRF 방지를 위한 state 생성
    const state = generateState();

    // state를 쿠키에 저장 (콜백에서 검증용)
    const cookieStore = await cookies();
    cookieStore.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10분
      path: '/',
    });

    // 로그인 후 리다이렉트할 URL 저장 (옵션)
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect') || '/';
    cookieStore.set('auth_redirect', redirectTo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10,
      path: '/',
    });

    // 카카오 인증 페이지로 리다이렉트
    const authUrl = getKakaoAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('카카오 로그인 시작 오류:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/login?error=kakao_init_failed`);
  }
}
