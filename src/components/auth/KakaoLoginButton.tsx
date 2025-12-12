'use client';

interface KakaoLoginButtonProps {
  redirectTo?: string;
  className?: string;
}

export default function KakaoLoginButton({
  redirectTo = '/',
  className = '',
}: KakaoLoginButtonProps) {
  const handleKakaoLogin = () => {
    // 카카오 로그인 API로 리다이렉트
    const loginUrl = `/api/auth/kakao?redirect=${encodeURIComponent(redirectTo)}`;
    window.location.href = loginUrl;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className={`
        flex items-center justify-center gap-3
        w-full py-3.5 px-4
        bg-[#FEE500] hover:bg-[#FADA0A]
        text-[#191919] font-medium
        rounded-xl
        transition-all duration-200
        focus:ring-2 focus:ring-[#FEE500]/50 focus:outline-none
        ${className}
      `}
    >
      {/* 카카오 로고 SVG */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 2C5.02944 2 1 5.16495 1 9.09091C1 11.5489 2.5584 13.7225 4.93152 14.9766L3.87868 18.4393C3.80256 18.6949 4.09064 18.9024 4.31818 18.7614L8.4697 16.1332C8.97152 16.1776 9.48208 16.2 10 16.2C14.9706 16.2 19 13.0169 19 9.09091C19 5.16495 14.9706 2 10 2Z"
          fill="#191919"
        />
      </svg>
      <span>카카오로 시작하기</span>
    </button>
  );
}
