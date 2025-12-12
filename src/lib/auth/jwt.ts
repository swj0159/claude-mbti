import { SignJWT, jwtVerify } from 'jose';
import { JwtPayload, AuthUser } from '@/lib/types';

// JWT 비밀키 (환경 변수에서 가져옴)
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  return new TextEncoder().encode(secret);
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  return new TextEncoder().encode(secret);
};

// Access Token 만료 시간: 15분
const ACCESS_TOKEN_EXPIRY = '15m';
// Refresh Token 만료 시간: 7일
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Access Token 생성
 */
export async function createAccessToken(user: AuthUser): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    nickname: user.nickname,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(getJwtSecret());

  return token;
}

/**
 * Refresh Token 생성
 */
export async function createRefreshToken(userId: string): Promise<string> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(getRefreshSecret());

  return token;
}

/**
 * Access Token 검증
 */
export async function verifyAccessToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Refresh Token 검증
 */
export async function verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret());
    return { sub: payload.sub as string };
  } catch {
    return null;
  }
}

/**
 * JWT Payload에서 AuthUser 추출
 */
export function payloadToUser(payload: JwtPayload): AuthUser {
  return {
    id: payload.sub,
    email: payload.email,
    nickname: payload.nickname,
    profileImage: null, // JWT에는 저장하지 않음, 필요시 DB 조회
  };
}
