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
        <section className="pt-40 pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-balance leading-[0.95] tracking-tight animate-fade-in">
              5분 만에
              <br />
              알아보는
              <br />
              나의 MBTI
            </h1>
            <p className="text-xl md:text-2xl text-muted mb-16 animate-slide-up font-light">
              20개 질문으로 정확하게 확인하세요
            </p>
            <Link
              href="/test"
              className="inline-block btn-primary text-lg animate-slide-up"
            >
              테스트 시작하기
            </Link>

            {/* Features */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="text-5xl mb-6">⚡</div>
                <h3 className="text-xl font-semibold mb-3">빠른 테스트</h3>
                <p className="text-body text-muted">
                  20문항으로 5분 안에 완료
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-6">🔒</div>
                <h3 className="text-xl font-semibold mb-3">회원가입 불필요</h3>
                <p className="text-body text-muted">
                  개인정보 걱정 없이 바로 시작
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-6">📤</div>
                <h3 className="text-xl font-semibold mb-3">쉬운 공유</h3>
                <p className="text-body text-muted">
                  이미지로 저장하고 SNS에 공유
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MBTI Types Grid */}
        <section className="py-32 px-6 bg-surface dark:bg-surface">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-heading-lg md:text-heading-xl font-bold text-center mb-20">
              16가지 성격 유형
            </h2>

            <div className="grid grid-cols-4 gap-3 md:gap-6">
              {mbtiGrid.flat().map((type) => {
                const info = mbtiTypes[type];
                return (
                  <div
                    key={type}
                    className="group relative p-4 md:p-6 rounded border border-border bg-background dark:bg-background hover:border-primary transition-colors duration-smooth cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl mb-2">{info.emoji}</div>
                      <div className="font-bold text-sm md:text-base mb-1">
                        {type}
                      </div>
                      <div className="hidden md:block text-xs text-muted">
                        {info.name}
                      </div>
                    </div>

                    {/* Tooltip for mobile */}
                    <div className="md:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {info.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-heading-lg md:text-heading-xl font-bold text-center mb-20">
              이렇게 진행돼요
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-center">
                <div className="text-6xl font-bold mb-6 text-primary">1</div>
                <h3 className="text-xl font-semibold mb-4">질문에 답하기</h3>
                <p className="text-body text-muted leading-relaxed">
                  직관적으로 20개 질문에 답해주세요
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-6 text-primary">2</div>
                <h3 className="text-xl font-semibold mb-4">결과 확인</h3>
                <p className="text-body text-muted leading-relaxed">
                  당신의 MBTI 유형과 상세 분석을 확인하세요
                </p>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-6 text-primary">3</div>
                <h3 className="text-xl font-semibold mb-4">친구와 공유</h3>
                <p className="text-body text-muted leading-relaxed">
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
