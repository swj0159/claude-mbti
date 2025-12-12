import { NextResponse } from 'next/server';
import { createClearCookieHeaders } from '@/lib/auth/cookies';

/**
 * POST /api/auth/logout
 * 로그아웃 - 인증 쿠키 삭제
 */
export async function POST() {
  try {
    const response = NextResponse.json({
      message: '로그아웃되었습니다.',
    });

    // 쿠키 삭제
    const clearHeaders = createClearCookieHeaders();
    clearHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { error: '로그아웃 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
