'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ResumeTestModal from '@/components/ui/ResumeTestModal';
import { mbtiTypes } from '@/lib/mbtiTypes';
import { MbtiType } from '@/lib/types';
import { useTestStore } from '@/stores/testStore';
import { questions } from '@/lib/questions';

const mbtiGrid: MbtiType[][] = [
  ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
];

export default function Home() {
  const router = useRouter();
  const { answers, currentIndex, isCompleted, reset } = useTestStore();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for in-progress test
  useEffect(() => {
    if (mounted && answers.length > 0 && !isCompleted) {
      setShowResumeModal(true);
    }
  }, [mounted, answers, isCompleted]);

  const handleResume = () => {
    setShowResumeModal(false);
    router.push('/test');
  };

  const handleRestart = () => {
    reset();
    setShowResumeModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-5" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance animate-fade-in">
              5분 만에 알아보는
              <br />
              <span className="gradient-text">나의 MBTI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 animate-slide-up">
              20개 질문으로 정확하게 확인하세요
            </p>
            <Link
              href="/test"
              className="inline-flex items-center gap-2 btn-primary text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slide-up"
            >
              테스트 시작하기
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">빠른 테스트</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  20문항으로 5분 안에 완료
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                <div className="text-3xl mb-3">🔒</div>
                <h3 className="font-semibold mb-2">회원가입 불필요</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  개인정보 걱정 없이 바로 시작
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                <div className="text-3xl mb-3">📤</div>
                <h3 className="font-semibold mb-2">쉬운 공유</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  이미지로 저장하고 SNS에 공유
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MBTI Types Grid */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              16가지 성격 유형
            </h2>

            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {mbtiGrid.flat().map((type) => {
                const info = mbtiTypes[type];
                return (
                  <div
                    key={type}
                    className="group relative p-3 md:p-4 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
                    style={{
                      borderBottom: `4px solid ${info.color}`,
                    }}
                  >
                    <div className="text-center">
                      <div className="text-xl md:text-2xl mb-1">{info.emoji}</div>
                      <div
                        className="font-bold text-sm md:text-base"
                        style={{ color: info.color }}
                      >
                        {type}
                      </div>
                      <div className="hidden md:block text-xs text-gray-500 mt-1">
                        {info.name}
                      </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {info.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              이렇게 진행돼요
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">질문에 답하기</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  직관적으로 20개 질문에 답해주세요
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary">2</span>
                </div>
                <h3 className="font-semibold mb-2">결과 확인</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  당신의 MBTI 유형과 상세 분석을 확인하세요
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-success">3</span>
                </div>
                <h3 className="font-semibold mb-2">친구와 공유</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  이미지로 저장하고 친구들과 공유하세요
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Resume Test Modal */}
      {showResumeModal && (
        <ResumeTestModal
          currentQuestion={currentIndex + 1}
          totalQuestions={questions.length}
          onResume={handleResume}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
