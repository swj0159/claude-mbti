import { Answer, MbtiType, DimensionScore, Dimension } from './types';
import { questions } from './questions';

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

export function getPercentage(userType: MbtiType, stats: Record<MbtiType, number>): number {
  const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
  if (total === 0) return 0;
  return Number(((stats[userType] / total) * 100).toFixed(1));
}
