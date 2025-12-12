'use client';

import { Question } from '@/lib/types';
import { options } from '@/lib/questions';

interface QuestionCardProps {
  question: Question;
  selectedScore: number | undefined;
  onSelect: (score: number) => void;
}

export default function QuestionCard({
  question,
  selectedScore,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full mb-4">
          Question {question.id}
        </span>
        <h2 className="text-xl md:text-2xl font-bold text-balance leading-relaxed">
          {question.text}
        </h2>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedScore === index;
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`
                option-button
                ${isSelected ? 'option-button-selected' : ''}
                flex items-center gap-3
              `}
            >
              <span
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'}
                `}
              >
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        직관적으로 답변해주세요
      </p>
    </div>
  );
}
