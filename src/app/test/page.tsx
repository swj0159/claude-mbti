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
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar current={currentIndex} total={questions.length} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-40 px-6">
        <div className="max-w-2xl mx-auto">
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedScore={currentAnswer?.score}
            onSelect={handleSelect}
          />
        </div>
      </main>

      {/* Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-6">
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`
              px-6 py-3 font-medium transition-colors duration-smooth
              ${
                currentIndex === 0
                  ? 'text-muted cursor-not-allowed'
                  : 'text-foreground hover:text-primary'
              }
            `}
          >
            이전
          </button>

          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className={`
              px-8 py-3 font-semibold rounded transition-colors duration-smooth
              ${
                canGoNext()
                  ? 'bg-primary text-white hover:bg-accent'
                  : 'bg-border text-muted cursor-not-allowed'
              }
            `}
          >
            {isLastQuestion() ? '결과 보기' : '다음'}
          </button>
        </div>
      </footer>

      {/* Home Link */}
      <Link
        href="/"
        onClick={reset}
        className="fixed top-6 left-6 z-50 text-sm text-muted hover:text-foreground transition-colors duration-smooth"
      >
        ← 홈
      </Link>
    </div>
  );
}
