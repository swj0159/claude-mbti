import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createAccessToken, createRefreshToken } from '@/lib/auth/jwt';
import { createAuthCookieHeaders } from '@/lib/auth/cookies';
import type { AuthUser } from '@/lib/types';

interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/auth/login
 * 이메일/비밀번호 로그인
 */
export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 조회 (credential 포함)
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        credential: true,
      },
    });

    // 사용자가 없거나 비밀번호 인증 정보가 없는 경우
    if (!user || !user.credential) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(
      password,
      user.credential.passwordHash
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
    };

    const accessToken = await createAccessToken(authUser);
    const refreshToken = await createRefreshToken(user.id);

    // 응답 생성
    const response = NextResponse.json({
      user: authUser,
      message: '로그인되었습니다.',
    });

    // 쿠키 설정
    const cookieHeaders = createAuthCookieHeaders(accessToken, refreshToken);
    cookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
