/**
 * 카카오 OAuth 2.0 헬퍼
 * Authorization Code + PKCE 플로우
 */

// 카카오 OAuth 엔드포인트
const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const KAKAO_USER_URL = 'https://kapi.kakao.com/v2/user/me';

// 카카오 사용자 정보 응답 타입
export interface KakaoUserInfo {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

/**
 * 카카오 로그인 URL 생성
 */
export function getKakaoAuthUrl(state: string): string {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/kakao/callback`;

  if (!clientId) {
    throw new Error('KAKAO_CLIENT_ID 환경 변수가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: state,
  });

  return `${KAKAO_AUTH_URL}?${params.toString()}`;
}

/**
 * Authorization Code로 Access Token 교환
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
}> {
  const clientId = process.env.KAKAO_CLIENT_ID;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}/api/auth/kakao/callback`;

  if (!clientId) {
    throw new Error('KAKAO_CLIENT_ID 환경 변수가 설정되지 않았습니다.');
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    redirect_uri: redirectUri,
    code: code,
  });

  // Client Secret이 있으면 추가 (선택 사항이지만 보안상 권장)
  if (clientSecret) {
    body.append('client_secret', clientSecret);
  }

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`카카오 토큰 교환 실패: ${error.error_description || error.error}`);
  }

  return response.json();
}

/**
 * 카카오 Access Token으로 사용자 정보 조회
 */
export async function getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
  const response = await fetch(KAKAO_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`카카오 사용자 정보 조회 실패: ${error.msg || 'Unknown error'}`);
  }

  return response.json();
}

/**
 * 카카오 사용자 정보에서 필요한 데이터 추출
 */
export function extractKakaoUserData(kakaoUser: KakaoUserInfo): {
  providerId: string;
  email: string | null;
  nickname: string;
  profileImage: string | null;
} {
  const profile = kakaoUser.kakao_account?.profile;

  return {
    providerId: String(kakaoUser.id),
    email: kakaoUser.kakao_account?.email || null,
    nickname: profile?.nickname || `카카오유저${kakaoUser.id}`,
    profileImage: profile?.profile_image_url || null,
  };
}

/**
 * CSRF 방지를 위한 state 생성
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
