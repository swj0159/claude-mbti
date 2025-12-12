'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTestStore } from '@/stores/testStore';
import { questions } from '@/lib/questions';
import ProgressBar from '@/components/test/ProgressBar';
import QuestionCard from '@/components/test/QuestionCard';

export default function TestPage() {
  const router = useRouter();
  const {
    currentIndex,
    setAnswer,
    nextQuestion,
    prevQuestion,
    calculateResult,
    getCurrentAnswer,
    canGoNext,
    isLastQuestion,
    reset,
  } = useTestStore();

  const currentQuestion = questions[currentIndex];
  const currentAnswer = getCurrentAnswer();

  const handleSelect = useCallback(
    (score: number) => {
      setAnswer({
        questionId: currentQuestion.id,
        dimension: currentQuestion.dimension,
        score,
      });
    },
    [currentQuestion, setAnswer]
  );

  const handleNext = useCallback(() => {
    if (isLastQuestion()) {
      calculateResult();
      router.push('/result');
    } else {
      nextQuestion();
    }
  }, [isLastQuestion, calculateResult, nextQuestion, router]);

  const handlePrev = useCallback(() => {
    prevQuestion();
  }, [prevQuestion]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1-5 keys for option selection
      if (e.key >= '1' && e.key <= '5') {
        const score = parseInt(e.key) - 1;
        handleSelect(score);
      }
      // Enter for next
      if (e.key === 'Enter' && canGoNext()) {
        handleNext();
      }
      // Backspace for previous
      if (e.key === 'Backspace' && currentIndex > 0) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, canGoNext, handleSelect, handleNext, handlePrev]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Progress */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-xl mx-auto">
          <ProgressBar current={currentIndex} total={questions.length} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-32 px-4">
        <div className="max-w-xl mx-auto">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedScore={currentAnswer?.score}
            onSelect={handleSelect}
          />
        </div>
      </main>

      {/* Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-xl mx-auto flex justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${
                currentIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            이전
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all
              ${
                canGoNext()
                  ? 'btn-primary'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              }
            `}
          >
            {isLastQuestion() ? '결과 보기' : '다음'}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </footer>

      {/* Home Link */}
      <Link
        href="/"
        onClick={reset}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
      >
        <svg
          className="w-5 h-5 text-gray-600 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Link>
    </div>
  );
}
