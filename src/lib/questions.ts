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
  {
    id: 4,
    dimension: 'E/I',
    direction: 'positive',
    target: 'E',
    text: '사람들이 많은 모임에서 활력을 느끼나요?',
  },
  {
    id: 5,
    dimension: 'E/I',
    direction: 'positive',
    target: 'I',
    text: '깊이 있는 대화를 나눌 수 있는 소수의 친구를 선호하나요?',
  },

  // S/N 차원 (감각/직관)
  {
    id: 6,
    dimension: 'S/N',
    direction: 'positive',
    target: 'S',
    text: '구체적이고 현실적인 정보를 선호하나요?',
  },
  {
    id: 7,
    dimension: 'S/N',
    direction: 'positive',
    target: 'N',
    text: '상상력과 가능성을 중요하게 생각하나요?',
  },
  {
    id: 8,
    dimension: 'S/N',
    direction: 'positive',
    target: 'S',
    text: '지금 이 순간에 집중하는 편인가요?',
  },
  {
    id: 9,
    dimension: 'S/N',
    direction: 'positive',
    target: 'N',
    text: '미래의 가능성에 대해 자주 생각하나요?',
  },
  {
    id: 10,
    dimension: 'S/N',
    direction: 'positive',
    target: 'S',
    text: '경험을 통해 직접 확인한 것을 더 신뢰하나요?',
  },

  // T/F 차원 (사고/감정)
  {
    id: 11,
    dimension: 'T/F',
    direction: 'positive',
    target: 'T',
    text: '결정을 내릴 때 논리와 원칙을 우선하나요?',
  },
  {
    id: 12,
    dimension: 'T/F',
    direction: 'positive',
    target: 'F',
    text: '다른 사람의 감정을 먼저 고려하나요?',
  },
  {
    id: 13,
    dimension: 'T/F',
    direction: 'positive',
    target: 'T',
    text: '객관적인 사실이 감정보다 중요하다고 생각하나요?',
  },
  {
    id: 14,
    dimension: 'T/F',
    direction: 'positive',
    target: 'F',
    text: '갈등 상황에서 관계 유지를 위해 양보하는 편인가요?',
  },
  {
    id: 15,
    dimension: 'T/F',
    direction: 'positive',
    target: 'T',
    text: '문제 해결 시 효율성을 가장 중요하게 생각하나요?',
  },

  // J/P 차원 (판단/인식)
  {
    id: 16,
    dimension: 'J/P',
    direction: 'positive',
    target: 'J',
    text: '계획을 세우고 일정에 따라 움직이는 것을 좋아하나요?',
  },
  {
    id: 17,
    dimension: 'J/P',
    direction: 'positive',
    target: 'P',
    text: '즉흥적이고 유연한 생활을 선호하나요?',
  },
  {
    id: 18,
    dimension: 'J/P',
    direction: 'positive',
    target: 'J',
    text: '마감 기한을 미리 지키는 편인가요?',
  },
  {
    id: 19,
    dimension: 'J/P',
    direction: 'positive',
    target: 'P',
    text: '여행 시 세부 일정보다 즉흥적인 탐험을 선호하나요?',
  },
  {
    id: 20,
    dimension: 'J/P',
    direction: 'positive',
    target: 'J',
    text: '결정을 빨리 내리고 상황을 마무리 짓는 것을 선호하나요?',
  },
];

export const options = [
  '전혀 아니다',
  '아니다',
  '보통이다',
  '그렇다',
  '매우 그렇다',
];
