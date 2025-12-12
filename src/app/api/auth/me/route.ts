import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/db';
import type { AuthUser } from '@/lib/types';

/**
 * GET /api/auth/me
 * 현재 로그인한 사용자 정보 조회
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // JWT 검증
    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    // DB에서 최신 사용자 정보 조회
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
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
    };

    return NextResponse.json({ user: authUser });
  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return NextResponse.json(
      { user: null, error: '사용자 정보를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}
