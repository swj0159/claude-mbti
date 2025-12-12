import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createAccessToken, createRefreshToken } from '@/lib/auth/jwt';
import { createAuthCookieHeaders } from '@/lib/auth/cookies';
import type { AuthUser } from '@/lib/types';

interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

/**
 * POST /api/auth/register
 * 이메일/비밀번호 회원가입
 */
export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json();
    const { email, password, nickname } = body;

    // 입력값 검증
    if (!email || !password || !nickname) {
      return NextResponse.json(
        { error: '이메일, 비밀번호, 닉네임을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 8) {
      return NextResponse.json(
        { error: '비밀번호는 8자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 닉네임 길이 검증
    if (nickname.length < 2 || nickname.length > 20) {
      return NextResponse.json(
        { error: '닉네임은 2자 이상 20자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 12);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        nickname,
        credential: {
          create: {
            passwordHash,
          },
        },
      },
    });

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
    const response = NextResponse.json(
      {
        user: authUser,
        message: '회원가입이 완료되었습니다.',
      },
      { status: 201 }
    );

    // 쿠키 설정
    const cookieHeaders = createAuthCookieHeaders(accessToken, refreshToken);
    cookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { error: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
