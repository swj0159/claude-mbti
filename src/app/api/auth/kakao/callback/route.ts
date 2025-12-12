import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import {
  exchangeCodeForTokens,
  getKakaoUserInfo,
  extractKakaoUserData,
} from '@/lib/auth/kakao';
import { createAccessToken, createRefreshToken } from '@/lib/auth/jwt';
import { createAuthCookieHeaders } from '@/lib/auth/cookies';

/**
 * GET /api/auth/kakao/callback
 * 카카오 OAuth 콜백 처리
 */
export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // 에러 파라미터 확인 (사용자가 로그인 취소 등)
    if (error) {
      console.error('카카오 OAuth 에러:', error);
      return NextResponse.redirect(`${baseUrl}/login?error=kakao_denied`);
    }

    // code 파라미터 확인
    if (!code) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
    }

    // state 검증 (CSRF 방지)
    const cookieStore = await cookies();
    const savedState = cookieStore.get('oauth_state')?.value;

    if (!state || state !== savedState) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid_state`);
    }

    // state 쿠키 삭제
    cookieStore.delete('oauth_state');

    // 리다이렉트 URL 가져오기
    const redirectTo = cookieStore.get('auth_redirect')?.value || '/';
    cookieStore.delete('auth_redirect');

    // Authorization Code로 카카오 Access Token 교환
    const kakaoTokens = await exchangeCodeForTokens(code);

    // 카카오 사용자 정보 조회
    const kakaoUser = await getKakaoUserInfo(kakaoTokens.access_token);
    const userData = extractKakaoUserData(kakaoUser);

    // DB에서 기존 소셜 계정 확인
    let user = await prisma.user.findFirst({
      where: {
        socialAccounts: {
          some: {
            provider: 'kakao',
            providerId: userData.providerId,
          },
        },
      },
    });

    if (!user) {
      // 신규 사용자 생성
      user = await prisma.user.create({
        data: {
          email: userData.email,
          nickname: userData.nickname,
          profileImage: userData.profileImage,
          socialAccounts: {
            create: {
              provider: 'kakao',
              providerId: userData.providerId,
            },
          },
        },
      });
    } else {
      // 기존 사용자 정보 업데이트 (프로필 이미지, 닉네임 등)
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          profileImage: userData.profileImage || user.profileImage,
          // 닉네임은 사용자가 직접 설정했을 수 있으므로 업데이트하지 않음
        },
      });
    }

    // 자체 JWT 토큰 생성
    const accessToken = await createAccessToken({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
    });
    const refreshToken = await createRefreshToken(user.id);

    // httpOnly 쿠키로 토큰 설정
    const cookieHeaders = createAuthCookieHeaders(accessToken, refreshToken);

    // 리다이렉트 응답 생성
    const response = NextResponse.redirect(`${baseUrl}${redirectTo}`);

    // 쿠키 헤더 설정
    cookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    return response;
  } catch (error) {
    console.error('카카오 콜백 처리 오류:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=callback_failed`);
  }
}
