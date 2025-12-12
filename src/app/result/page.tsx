'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTestStore } from '@/stores/testStore';
import { mbtiTypes } from '@/lib/mbtiTypes';
import { Statistics } from '@/lib/types';
import { generateResultImage, downloadImage } from '@/lib/imageGenerator';
import Header from '@/components/ui/Header';
import TypeCard from '@/components/result/TypeCard';
import TabContent from '@/components/result/TabContent';
import StatisticsChart from '@/components/result/StatisticsChart';
import ShareButtons from '@/components/result/ShareButtons';

/**
 * 통계 데이터를 불러오지 못했을 때 사용되는 기본 통계값
 * @constant {Statistics}
 */
const defaultStatistics: Statistics = {
  stats: {
    INTJ: 5234, INTP: 4123, ENTJ: 3456, ENTP: 4567,
    INFJ: 6789, INFP: 7890, ENFJ: 5678, ENFP: 8901,
    ISTJ: 4321, ISFJ: 5432, ESTJ: 3210, ESFJ: 4321,
    ISTP: 2345, ISFP: 3456, ESTP: 2234, ESFP: 3345,
  },
  total: 75302,
  lastUpdated: new Date().toISOString(),
};

/**
 * MBTI 테스트 결과를 표시하는 페이지 컴포넌트
 *
 * @description
 * 테스트 완료 후 사용자의 MBTI 유형, 상세 설명, 전체 통계를 보여줍니다.
 * 결과가 없으면 홈으로 리다이렉트됩니다.
 *
 * @returns {JSX.Element} 결과 페이지 UI 또는 로딩 스피너
 */
export default function ResultPage() {
  const router = useRouter();
  const { result, answers, reset } = useTestStore();
  const [mounted, setMounted] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>(defaultStatistics);
  const [statsLoading, setStatsLoading] = useState(true);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Submit result and fetch statistics
  useEffect(() => {
    if (!mounted || !result || hasSubmitted.current) return;

    /**
     * 테스트 결과를 서버에 제출하고 전체 통계를 조회하는 함수
     *
     * @async
     * @function submitAndFetchStats
     * @returns {Promise<void>} 반환값 없음
     * @throws 네트워크 오류 시 콘솔에 에러 로깅 (UI에는 영향 없음)
     *
     * @description
     * 1. hasSubmitted 플래그로 중복 실행 방지
     * 2. POST /api/submit-result로 결과 제출
     * 3. GET /api/statistics로 통계 조회
     * 4. 성공/실패 관계없이 로딩 상태 해제
     */
    const submitAndFetchStats = async () => {
      hasSubmitted.current = true;

      // Submit result to API
      try {
        await fetch('/api/submit-result', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mbtiType: result, answers }),
        });
      } catch (error) {
        console.error('Failed to submit result:', error);
      }

      // Fetch statistics
      try {
        const response = await fetch('/api/statistics');
        if (response.ok) {
          const data = await response.json();
          setStatistics(data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    submitAndFetchStats();
  }, [mounted, result, answers]);

  // Redirect if no result
  useEffect(() => {
    if (mounted && !result) {
      router.push('/');
    }
  }, [mounted, result, router]);

  if (!mounted || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const typeInfo = mbtiTypes[result];

  /**
   * MBTI 결과 이미지를 생성하고 다운로드하는 핸들러
   *
   * @async
   * @function handleGenerateImage
   * @returns {Promise<void>} 반환값 없음
   * @throws 이미지 생성 실패 시 alert으로 사용자에게 알림
   *
   * @description
   * Canvas API를 사용해 결과 카드 이미지를 생성하고,
   * PNG 파일로 자동 다운로드합니다.
   */
  const handleGenerateImage = async () => {
    try {
      const blob = await generateResultImage(typeInfo);
      downloadImage(blob, `mbti-${typeInfo.code}.png`);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('이미지 생성에 실패했습니다. 스크린샷을 이용해주세요.');
    }
  };

  /**
   * 테스트를 다시 시작하는 핸들러
   *
   * @function handleRetake
   * @returns {void} 반환값 없음
   *
   * @description
   * Zustand 스토어를 초기화하고 테스트 페이지로 이동합니다.
   */
  const handleRetake = () => {
    reset();
    router.push('/test');
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="pt-24 px-4">
        <div className="max-w-xl mx-auto">
          {/* Confetti animation placeholder */}
          <div className="text-center mb-6 animate-fade-in">
            <span className="text-4xl">🎉</span>
          </div>

          {/* Result Card */}
          <TypeCard typeInfo={typeInfo} />

          {/* Tab Content */}
          <TabContent typeInfo={typeInfo} />

          {/* Statistics */}
          <StatisticsChart stats={statistics} userType={result} loading={statsLoading} />

          {/* Share Buttons */}
          <ShareButtons typeInfo={typeInfo} onGenerateImage={handleGenerateImage} />

          {/* Retake Button */}
          <button
            onClick={handleRetake}
            className="w-full mt-4 py-3 text-center text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            다시 테스트하기
          </button>

          {/* Back to Home */}
          <Link
            href="/"
            onClick={reset}
            className="block w-full mt-2 py-3 text-center text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    </div>
  );
}
