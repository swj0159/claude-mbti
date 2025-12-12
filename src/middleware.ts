import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT 비밀키
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
  }
  return new TextEncoder().encode(secret);
};

// 보호되는 경로 패턴
const protectedRoutes = ['/profile', '/mypage'];

// 인증된 사용자가 접근하면 안 되는 경로 (로그인, 회원가입)
const authRoutes = ['/login', '/register'];

// API 경로 중 보호되어야 하는 패턴
const protectedApiRoutes = ['/api/protected'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 토큰 검증
  const accessToken = request.cookies.get('access_token')?.value;
  let isAuthenticated = false;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, getJwtSecret());
      isAuthenticated = true;
    } catch {
      // 토큰이 만료되었거나 유효하지 않음
      isAuthenticated = false;
    }
  }

  // 보호된 페이지 접근 시 인증 확인
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 보호된 API 접근 시 인증 확인
  const isProtectedApi = protectedApiRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedApi && !isAuthenticated) {
    return NextResponse.json(
      { error: '인증이 필요합니다.', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  // 이미 로그인한 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 인증 정보를 헤더에 추가하여 하위 라우트에서 사용할 수 있게 함
  const requestHeaders = new Headers(request.headers);
  if (isAuthenticated && accessToken) {
    requestHeaders.set('x-user-authenticated', 'true');
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    // 보호된 페이지
    '/profile/:path*',
    '/mypage/:path*',
    // 인증 페이지 (로그인된 사용자 리다이렉트용)
    '/login',
    '/register',
    // 보호된 API
    '/api/protected/:path*',
  ],
};
