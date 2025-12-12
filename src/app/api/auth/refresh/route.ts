import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from '@/lib/auth/jwt';
import {
  REFRESH_TOKEN_COOKIE,
  createAuthCookieHeaders,
  createClearCookieHeaders,
} from '@/lib/auth/cookies';
import type { AuthUser } from '@/lib/types';

/**
 * POST /api/auth/refresh
 * Access Token 갱신
 * Refresh Token은 Path=/api/auth/refresh 로 제한되어 있어
 * 이 엔드포인트에서만 접근 가능
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // Refresh Token 검증
    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      // 리프레시 토큰이 유효하지 않으면 쿠키 삭제
      const response = NextResponse.json(
        { error: '유효하지 않은 리프레시 토큰입니다.' },
        { status: 401 }
      );

      const clearHeaders = createClearCookieHeaders();
      clearHeaders.forEach((cookie) => {
        response.headers.append('Set-Cookie', cookie);
      });

      return response;
    }

    // DB에서 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
      },
    });

    if (!user) {
      const response = NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 401 }
      );

      const clearHeaders = createClearCookieHeaders();
      clearHeaders.forEach((cookie) => {
        response.headers.append('Set-Cookie', cookie);
      });

      return response;
    }

    // 새 토큰 생성
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
    };

    const newAccessToken = await createAccessToken(authUser);
    const newRefreshToken = await createRefreshToken(user.id);

    // 응답 생성
    const response = NextResponse.json({
      user: authUser,
      message: '토큰이 갱신되었습니다.',
    });

    // 새 쿠키 설정
    const cookieHeaders = createAuthCookieHeaders(newAccessToken, newRefreshToken);
    cookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('토큰 갱신 오류:', error);
    return NextResponse.json(
      { error: '토큰 갱신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
