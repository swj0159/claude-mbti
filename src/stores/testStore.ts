import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Answer, MbtiType } from '@/lib/types';
import { questions } from '@/lib/questions';
import { calculateMbtiType } from '@/lib/mbti';

interface TestState {
  // State
  answers: Answer[];
  currentIndex: number;
  result: MbtiType | null;
  isCompleted: boolean;

  // Actions
  setAnswer: (answer: Answer) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  calculateResult: () => MbtiType;
  reset: () => void;

  // Getters
  getCurrentAnswer: () => Answer | undefined;
  canGoNext: () => boolean;
  isLastQuestion: () => boolean;
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      // Initial State
      answers: [],
      currentIndex: 0,
      result: null,
      isCompleted: false,

      // Actions
      setAnswer: (answer) => {
        set((state) => {
          const existingIndex = state.answers.findIndex(
            (a) => a.questionId === answer.questionId
          );

          if (existingIndex >= 0) {
            const newAnswers = [...state.answers];
            newAnswers[existingIndex] = answer;
            return { answers: newAnswers };
          }

          return { answers: [...state.answers, answer] };
        });
      },

      nextQuestion: () => {
        set((state) => {
          if (state.currentIndex < questions.length - 1) {
            return { currentIndex: state.currentIndex + 1 };
          }
          return state;
        });
      },

      prevQuestion: () => {
        set((state) => {
          if (state.currentIndex > 0) {
            return { currentIndex: state.currentIndex - 1 };
          }
          return state;
        });
      },

      calculateResult: () => {
        const { answers } = get();
        if (answers.length === questions.length) {
          const mbtiType = calculateMbtiType(answers);
          set({ result: mbtiType, isCompleted: true });
          return mbtiType;
        }
        return 'ENFP'; // Default fallback
      },

      reset: () => {
        set({
          answers: [],
          currentIndex: 0,
          result: null,
          isCompleted: false,
        });
      },

      // Getters
      getCurrentAnswer: () => {
        const { answers, currentIndex } = get();
        const currentQuestion = questions[currentIndex];
        return answers.find((a) => a.questionId === currentQuestion.id);
      },

      canGoNext: () => {
        return get().getCurrentAnswer() !== undefined;
      },

      isLastQuestion: () => {
        return get().currentIndex === questions.length - 1;
      },
    }),
    {
      name: 'mbti-test-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        answers: state.answers,
        currentIndex: state.currentIndex,
        result: state.result,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
