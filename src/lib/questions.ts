import { Question } from './types';

export const questions: Question[] = [
  // E/I 차원 (외향/내향)
  {
    id: 1,
    dimension: 'E/I',
    direction: 'positive',
    target: 'E',
    text: '친구들과 함께 있을 때 에너지를 얻나요?',
  },
  {
    id: 2,
    dimension: 'E/I',
    direction: 'positive',
    target: 'I',
    text: '혼자만의 시간이 꼭 필요한가요?',
  },
  {
    id: 3,
    dimension: 'E/I',
    direction: 'positive',
    target: 'E',
    text: '처음 만난 사람과도 대화를 먼저 시작하는 편인가요?',
  },

  // S/N 차원 (감각/직관)
  {
    id: 4,
    dimension: 'S/N',
    direction: 'positive',
    target: 'S',
    text: '구체적이고 현실적인 정보를 선호하나요?',
  },
  {
    id: 5,
    dimension: 'S/N',
    direction: 'positive',
    target: 'N',
    text: '상상력과 가능성을 중요하게 생각하나요?',
  },
  {
    id: 6,
    dimension: 'S/N',
    direction: 'positive',
    target: 'S',
    text: '지금 이 순간에 집중하는 편인가요?',
  },

  // T/F 차원 (사고/감정)
  {
    id: 7,
    dimension: 'T/F',
    direction: 'positive',
    target: 'T',
    text: '결정을 내릴 때 논리와 원칙을 우선하나요?',
  },
  {
    id: 8,
    dimension: 'T/F',
    direction: 'positive',
    target: 'F',
    text: '다른 사람의 감정을 먼저 고려하나요?',
  },
  {
    id: 9,
    dimension: 'T/F',
    direction: 'positive',
    target: 'T',
    text: '객관적인 사실이 감정보다 중요하다고 생각하나요?',
  },

  // J/P 차원 (판단/인식)
  {
    id: 10,
    dimension: 'J/P',
    direction: 'positive',
    target: 'J',
    text: '계획을 세우고 일정에 따라 움직이는 것을 좋아하나요?',
  },
  {
    id: 11,
    dimension: 'J/P',
    direction: 'positive',
    target: 'P',
    text: '즉흥적이고 유연한 생활을 선호하나요?',
  },
  {
    id: 12,
    dimension: 'J/P',
    direction: 'positive',
    target: 'J',
    text: '마감 기한을 미리 지키는 편인가요?',
  },
];

export const options = [
  '전혀 아니다',
  '아니다',
  '보통이다',
  '그렇다',
  '매우 그렇다',
];
