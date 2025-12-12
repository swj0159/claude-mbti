'use client';

interface ResumeTestModalProps {
  currentQuestion: number;
  totalQuestions: number;
  onResume: () => void;
  onRestart: () => void;
}

export default function ResumeTestModal({
  currentQuestion,
  totalQuestions,
  onResume,
  onRestart,
}: ResumeTestModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6 shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <h2 className="text-xl font-bold mb-2">
            진행 중인 테스트가 있어요
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-1">
            {currentQuestion}/{totalQuestions}번째 질문까지 진행하셨어요
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            이어서 테스트를 진행하시겠습니까?
          </p>

          <div className="space-y-3">
            <button
              onClick={onResume}
              className="w-full btn-primary"
            >
              이어서 하기
            </button>
            <button
              onClick={onRestart}
              className="w-full btn-secondary"
            >
              처음부터 다시하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
