import { Answer, MbtiType, DimensionScore, Dimension } from './types';
import { questions } from './questions';

/**
 * 사용자 답변을 기반으로 MBTI 유형을 계산합니다.
 *
 * @param {Answer[]} answers - 각 질문에 대한 답변 배열 (20개)
 * @returns {MbtiType} 계산된 MBTI 유형 코드
 *
 * @example
 * // 기본 사용
 * const answers = [
 *   { questionId: 1, score: 4 },
 *   { questionId: 2, score: 1 },
 *   { questionId: 3, score: 3 },
 *   // ... 총 20개
 * ];
 * const result = calculateMbtiType(answers);
 * console.log(result); // 'ENFP'
 *
 * @example
 * // 동점 처리: E/I, S/N, T/F, J/P 동점 시 앞 글자(E, S, T, J) 선택
 * // E=10, I=10 → 'E' 선택
 */
export function calculateMbtiType(answers: Answer[]): MbtiType {
  // 각 차원별 점수 계산
  const scores: Record<Dimension, { first: number; second: number }> = {
    'E/I': { first: 0, second: 0 }, // E vs I
    'S/N': { first: 0, second: 0 }, // S vs N
    'T/F': { first: 0, second: 0 }, // T vs F
    'J/P': { first: 0, second: 0 }, // J vs P
  };

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const { dimension, target } = question;
    const score = answer.score; // 0-4

    // target에 따라 점수 배분
    // E, S, T, J가 target이면 first에, I, N, F, P가 target이면 second에 점수 추가
    const isFirst = ['E', 'S', 'T', 'J'].includes(target);

    if (isFirst) {
      scores[dimension].first += score;
    } else {
      scores[dimension].second += score;
    }
  });

  // MBTI 타입 결정
  const result: string[] = [];

  // E/I
  if (scores['E/I'].first >= scores['E/I'].second) {
    result.push('E');
  } else {
    result.push('I');
  }

  // S/N
  if (scores['S/N'].first >= scores['S/N'].second) {
    result.push('S');
  } else {
    result.push('N');
  }

  // T/F
  if (scores['T/F'].first >= scores['T/F'].second) {
    result.push('T');
  } else {
    result.push('F');
  }

  // J/P
  if (scores['J/P'].first >= scores['J/P'].second) {
    result.push('J');
  } else {
    result.push('P');
  }

  return result.join('') as MbtiType;
}

/**
 * 각 MBTI 차원별 점수를 계산하여 반환합니다.
 *
 * @param {Answer[]} answers - 각 질문에 대한 답변 배열
 * @returns {DimensionScore[]} 4개 차원(E/I, S/N, T/F, J/P)의 점수 배열
 *
 * @example
 * const answers = [
 *   { questionId: 1, score: 4 },
 *   { questionId: 2, score: 2 },
 *   // ...
 * ];
 * const scores = getDimensionScores(answers);
 * // [
 * //   { dimension: 'E/I', firstScore: 12, secondScore: 8 },
 * //   { dimension: 'S/N', firstScore: 6, secondScore: 14 },
 * //   { dimension: 'T/F', firstScore: 10, secondScore: 10 },
 * //   { dimension: 'J/P', firstScore: 5, secondScore: 15 }
 * // ]
 *
 * @example
 * // 결과 차트 표시에 활용
 * const scores = getDimensionScores(answers);
 * scores.forEach(({ dimension, firstScore, secondScore }) => {
 *   const total = firstScore + secondScore;
 *   const percentage = (firstScore / total) * 100;
 *   console.log(`${dimension}: ${percentage.toFixed(0)}%`);
 * });
 */
export function getDimensionScores(answers: Answer[]): DimensionScore[] {
  const scores: Record<Dimension, { first: number; second: number }> = {
    'E/I': { first: 0, second: 0 },
    'S/N': { first: 0, second: 0 },
    'T/F': { first: 0, second: 0 },
    'J/P': { first: 0, second: 0 },
  };

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    const { dimension, target } = question;
    const score = answer.score;

    const isFirst = ['E', 'S', 'T', 'J'].includes(target);

    if (isFirst) {
      scores[dimension].first += score;
    } else {
      scores[dimension].second += score;
    }
  });

  return Object.entries(scores).map(([dimension, { first, second }]) => ({
    dimension: dimension as Dimension,
    firstScore: first,
    secondScore: second,
  }));
}

/**
 * 특정 MBTI 유형이 전체 통계에서 차지하는 비율을 계산합니다.
 *
 * @param {MbtiType} userType - 비율을 계산할 MBTI 유형
 * @param {Record<MbtiType, number>} stats - 전체 MBTI 유형별 인원 통계
 * @returns {number} 백분율 (소수점 1자리, 예: 12.5)
 *
 * @example
 * const stats = {
 *   INTJ: 100, INTP: 150, ENTJ: 80, ENTP: 120,
 *   INFJ: 90, INFP: 200, ENFJ: 110, ENFP: 180,
 *   ISTJ: 130, ISFJ: 140, ESTJ: 95, ESFJ: 125,
 *   ISTP: 70, ISFP: 85, ESTP: 60, ESFP: 75,
 * };
 * const percentage = getPercentage('INFP', stats);
 * console.log(percentage); // 11.8 (200 / 1710 * 100)
 *
 * @example
 * // 통계가 비어있는 경우
 * const emptyStats = { INTJ: 0, INTP: 0, ... };
 * getPercentage('INTJ', emptyStats); // 0
 */
export function getPercentage(userType: MbtiType, stats: Record<MbtiType, number>): number {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  return Number(((stats[userType] / total) * 100).toFixed(1));
}
