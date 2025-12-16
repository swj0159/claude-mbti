'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useUser, useLogout } from '@/hooks/useUser';

export default function Header() {
  const { user, isLoading } = useUser();
  const { logout } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
          <span className="text-3xl">🧪</span>
          <span className="font-bold text-2xl">
            MBTI Lab
          </span>
        </Link>

        {/* 오른쪽 영역 */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* 로그인 상태에 따른 UI */}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {/* 프로필 이미지 또는 기본 아바타 */}
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.nickname}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.nickname.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                  {user.nickname}
                </span>
                {/* 드롭다운 화살표 */}
                <svg
                  className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {showDropdown && (
                <>
                  {/* 백드롭 */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  {/* 메뉴 */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    {/* 사용자 정보 */}
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium truncate">{user.nickname}</p>
                      {user.email && (
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      )}
                    </div>
                    {/* 메뉴 항목 */}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium hover:text-muted transition-colors duration-smooth"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
