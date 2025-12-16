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
      <div className="mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-balance leading-tight mb-3">
          {question.text}
        </h2>
        <p className="text-caption text-muted">
          직관적으로 답변해주세요
        </p>
      </div>

      <div className="space-y-4">
        {options.map((option, index) => {
          const isSelected = selectedScore === index;
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`
                option-button
                ${isSelected ? 'option-button-selected' : ''}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
